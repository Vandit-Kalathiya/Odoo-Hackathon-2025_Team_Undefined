-- Location: supabase/migrations/20250712034605_stackit_auth_and_questions.sql
-- StackIt Q&A Platform - Authentication & Questions Module

-- 1. Types and Enums
CREATE TYPE public.user_role AS ENUM ('admin', 'moderator', 'member');
CREATE TYPE public.question_status AS ENUM ('open', 'closed', 'duplicate');
CREATE TYPE public.answer_status AS ENUM ('pending', 'accepted', 'rejected');

-- 2. Core Tables
-- User profiles intermediary table (CRITICAL for PostgREST compatibility)
CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    username TEXT UNIQUE,
    bio TEXT,
    location TEXT,
    website_url TEXT,
    avatar_url TEXT,
    role public.user_role DEFAULT 'member'::public.user_role,
    reputation INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Questions table
CREATE TABLE public.questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    tags TEXT[] DEFAULT '{}',
    vote_score INTEGER DEFAULT 0,
    view_count INTEGER DEFAULT 0,
    answer_count INTEGER DEFAULT 0,
    has_accepted_answer BOOLEAN DEFAULT false,
    status public.question_status DEFAULT 'open'::public.question_status,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT questions_title_length CHECK (length(title) >= 10 AND length(title) <= 150),
    CONSTRAINT questions_description_length CHECK (length(description) >= 30),
    CONSTRAINT questions_tags_limit CHECK (array_length(tags, 1) <= 5)
);

-- Answers table
CREATE TABLE public.answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_id UUID REFERENCES public.questions(id) ON DELETE CASCADE,
    author_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    vote_score INTEGER DEFAULT 0,
    is_accepted BOOLEAN DEFAULT false,
    status public.answer_status DEFAULT 'pending'::public.answer_status,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT answers_content_length CHECK (length(content) >= 30)
);

-- Comments table
CREATE TABLE public.comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_id UUID REFERENCES public.questions(id) ON DELETE CASCADE,
    answer_id UUID REFERENCES public.answers(id) ON DELETE CASCADE,
    author_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    vote_score INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT comments_content_length CHECK (length(content) >= 5 AND length(content) <= 600),
    CONSTRAINT comments_target_check CHECK (
        (question_id IS NOT NULL AND answer_id IS NULL) OR 
        (question_id IS NULL AND answer_id IS NOT NULL)
    )
);

-- Question votes table
CREATE TABLE public.question_votes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_id UUID REFERENCES public.questions(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    vote_type INTEGER NOT NULL CHECK (vote_type IN (-1, 1)), -- -1 for downvote, 1 for upvote
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(question_id, user_id)
);

-- Answer votes table
CREATE TABLE public.answer_votes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    answer_id UUID REFERENCES public.answers(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    vote_type INTEGER NOT NULL CHECK (vote_type IN (-1, 1)),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(answer_id, user_id)
);

-- Tags table for better tag management
CREATE TABLE public.tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. Essential Indexes
CREATE INDEX idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX idx_user_profiles_username ON public.user_profiles(username);
CREATE INDEX idx_questions_author_id ON public.questions(author_id);
CREATE INDEX idx_questions_tags ON public.questions USING GIN(tags);
CREATE INDEX idx_questions_created_at ON public.questions(created_at DESC);
CREATE INDEX idx_questions_vote_score ON public.questions(vote_score DESC);
CREATE INDEX idx_answers_question_id ON public.answers(question_id);
CREATE INDEX idx_answers_author_id ON public.answers(author_id);
CREATE INDEX idx_comments_question_id ON public.comments(question_id);
CREATE INDEX idx_comments_answer_id ON public.comments(answer_id);
CREATE INDEX idx_question_votes_question_id ON public.question_votes(question_id);
CREATE INDEX idx_answer_votes_answer_id ON public.answer_votes(answer_id);
CREATE INDEX idx_tags_name ON public.tags(name);

-- 4. RLS Setup
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.answer_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;

-- 5. Helper Functions
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.user_profiles up
    WHERE up.id = auth.uid() AND up.role = 'admin'::public.user_role
)
$$;

CREATE OR REPLACE FUNCTION public.is_moderator_or_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.user_profiles up
    WHERE up.id = auth.uid() AND up.role IN ('admin'::public.user_role, 'moderator'::public.user_role)
)
$$;

CREATE OR REPLACE FUNCTION public.owns_question(question_uuid UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.questions q
    WHERE q.id = question_uuid AND q.author_id = auth.uid()
)
$$;

CREATE OR REPLACE FUNCTION public.owns_answer(answer_uuid UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.answers a
    WHERE a.id = answer_uuid AND a.author_id = auth.uid()
)
$$;

CREATE OR REPLACE FUNCTION public.owns_comment(comment_uuid UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.comments c
    WHERE c.id = comment_uuid AND c.author_id = auth.uid()
)
$$;

-- Function for automatic profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name, username, role)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'member')::public.user_role
  );
  RETURN NEW;
END;
$$;

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update question stats
CREATE OR REPLACE FUNCTION public.update_question_stats()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        -- Update answer count
        UPDATE public.questions 
        SET answer_count = answer_count + 1,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = NEW.question_id;
        
        -- Check if this is an accepted answer
        IF NEW.is_accepted THEN
            UPDATE public.questions 
            SET has_accepted_answer = true
            WHERE id = NEW.question_id;
        END IF;
        
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        -- Handle accepted answer changes
        IF OLD.is_accepted != NEW.is_accepted THEN
            UPDATE public.questions 
            SET has_accepted_answer = EXISTS(
                SELECT 1 FROM public.answers 
                WHERE question_id = NEW.question_id AND is_accepted = true
            )
            WHERE id = NEW.question_id;
        END IF;
        
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        -- Update answer count
        UPDATE public.questions 
        SET answer_count = answer_count - 1,
            has_accepted_answer = CASE 
                WHEN OLD.is_accepted THEN EXISTS(
                    SELECT 1 FROM public.answers 
                    WHERE question_id = OLD.question_id AND is_accepted = true AND id != OLD.id
                )
                ELSE has_accepted_answer
            END,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = OLD.question_id;
        
        RETURN OLD;
    END IF;
    
    RETURN NULL;
END;
$$;

-- Trigger for answer stats
CREATE TRIGGER trigger_update_question_stats
    AFTER INSERT OR UPDATE OR DELETE ON public.answers
    FOR EACH ROW EXECUTE FUNCTION public.update_question_stats();

-- 6. RLS Policies
-- User profiles policies
CREATE POLICY "public_can_view_profiles" ON public.user_profiles 
FOR SELECT TO public USING (true);

CREATE POLICY "users_can_update_own_profile" ON public.user_profiles 
FOR UPDATE TO authenticated 
USING (auth.uid() = id) 
WITH CHECK (auth.uid() = id);

-- Questions policies
CREATE POLICY "public_can_view_questions" ON public.questions 
FOR SELECT TO public USING (true);

CREATE POLICY "authenticated_can_create_questions" ON public.questions 
FOR INSERT TO authenticated 
WITH CHECK (auth.uid() = author_id);

CREATE POLICY "authors_can_update_own_questions" ON public.questions 
FOR UPDATE TO authenticated 
USING (public.owns_question(id) OR public.is_moderator_or_admin()) 
WITH CHECK (public.owns_question(id) OR public.is_moderator_or_admin());

CREATE POLICY "authors_can_delete_own_questions" ON public.questions 
FOR DELETE TO authenticated 
USING (public.owns_question(id) OR public.is_moderator_or_admin());

-- Answers policies
CREATE POLICY "public_can_view_answers" ON public.answers 
FOR SELECT TO public USING (true);

CREATE POLICY "authenticated_can_create_answers" ON public.answers 
FOR INSERT TO authenticated 
WITH CHECK (auth.uid() = author_id);

CREATE POLICY "authors_can_update_own_answers" ON public.answers 
FOR UPDATE TO authenticated 
USING (public.owns_answer(id) OR public.is_moderator_or_admin()) 
WITH CHECK (public.owns_answer(id) OR public.is_moderator_or_admin());

CREATE POLICY "authors_can_delete_own_answers" ON public.answers 
FOR DELETE TO authenticated 
USING (public.owns_answer(id) OR public.is_moderator_or_admin());

-- Comments policies
CREATE POLICY "public_can_view_comments" ON public.comments 
FOR SELECT TO public USING (true);

CREATE POLICY "authenticated_can_create_comments" ON public.comments 
FOR INSERT TO authenticated 
WITH CHECK (auth.uid() = author_id);

CREATE POLICY "authors_can_update_own_comments" ON public.comments 
FOR UPDATE TO authenticated 
USING (public.owns_comment(id) OR public.is_moderator_or_admin()) 
WITH CHECK (public.owns_comment(id) OR public.is_moderator_or_admin());

CREATE POLICY "authors_can_delete_own_comments" ON public.comments 
FOR DELETE TO authenticated 
USING (public.owns_comment(id) OR public.is_moderator_or_admin());

-- Votes policies
CREATE POLICY "authenticated_can_manage_question_votes" ON public.question_votes 
FOR ALL TO authenticated 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "authenticated_can_manage_answer_votes" ON public.answer_votes 
FOR ALL TO authenticated 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);

-- Tags policies
CREATE POLICY "public_can_view_tags" ON public.tags 
FOR SELECT TO public USING (true);

CREATE POLICY "authenticated_can_create_tags" ON public.tags 
FOR INSERT TO authenticated 
WITH CHECK (true);

CREATE POLICY "admins_can_manage_tags" ON public.tags 
FOR ALL TO authenticated 
USING (public.is_admin()) 
WITH CHECK (public.is_admin());

-- 7. Mock Data
DO $$
DECLARE
    admin_uuid UUID := gen_random_uuid();
    user1_uuid UUID := gen_random_uuid();
    user2_uuid UUID := gen_random_uuid();
    user3_uuid UUID := gen_random_uuid();
    question1_uuid UUID := gen_random_uuid();
    question2_uuid UUID := gen_random_uuid();
    question3_uuid UUID := gen_random_uuid();
    answer1_uuid UUID := gen_random_uuid();
    answer2_uuid UUID := gen_random_uuid();
BEGIN
    -- Create auth users with required fields
    INSERT INTO auth.users (
        id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
        created_at, updated_at, raw_user_meta_data, raw_app_meta_data,
        is_sso_user, is_anonymous, confirmation_token, confirmation_sent_at,
        recovery_token, recovery_sent_at, email_change_token_new, email_change,
        email_change_sent_at, email_change_token_current, email_change_confirm_status,
        reauthentication_token, reauthentication_sent_at, phone, phone_change,
        phone_change_token, phone_change_sent_at
    ) VALUES
        (admin_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'admin@stackit.com', crypt('password123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Stack Admin", "username": "stackadmin", "role": "admin"}'::jsonb, 
         '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (user1_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'sarah.chen@example.com', crypt('password123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Sarah Chen", "username": "sarahchen"}'::jsonb, 
         '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (user2_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'michael.rodriguez@example.com', crypt('password123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Michael Rodriguez", "username": "mikero"}'::jsonb, 
         '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (user3_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'emily.johnson@example.com', crypt('password123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Emily Johnson", "username": "emilyj"}'::jsonb, 
         '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null);

    -- Update user profiles with additional data
    UPDATE public.user_profiles SET
        bio = 'Full-stack developer with 8+ years of experience in React and Node.js',
        location = 'San Francisco, CA',
        reputation = 2450
    WHERE id = user1_uuid;

    UPDATE public.user_profiles SET
        bio = 'Python developer and data scientist passionate about machine learning',
        location = 'Austin, TX',
        reputation = 1890
    WHERE id = user2_uuid;

    UPDATE public.user_profiles SET
        bio = 'Frontend developer specializing in CSS and responsive design',
        location = 'New York, NY',
        reputation = 3200
    WHERE id = user3_uuid;

    -- Insert sample tags
    INSERT INTO public.tags (name, description, usage_count) VALUES
        ('react', 'A JavaScript library for building user interfaces', 125),
        ('javascript', 'High-level programming language for web development', 287),
        ('python', 'General-purpose programming language', 198),
        ('css', 'Cascading Style Sheets for styling web pages', 156),
        ('nodejs', 'JavaScript runtime built on Chrome V8 JavaScript engine', 143),
        ('hooks', 'React feature for using state in functional components', 89),
        ('state-management', 'Techniques for managing application state', 67),
        ('performance', 'Optimization techniques for faster applications', 92),
        ('database', 'Data storage and retrieval systems', 134),
        ('sql', 'Structured Query Language for databases', 167);

    -- Insert sample questions
    INSERT INTO public.questions (id, author_id, title, description, tags, vote_score, view_count, created_at) VALUES
        (question1_uuid, user1_uuid, 
         'How to implement React hooks for state management?',
         'I am working on a React application and want to understand the best practices for using hooks like useState and useEffect. I have been using class components but want to migrate to functional components.\n\nSpecifically, I am looking for guidance on:\n- When to use useState vs useReducer\n- How to handle side effects properly\n- Best practices for custom hooks',
         ARRAY['react', 'hooks', 'javascript', 'state-management'],
         15, 234, now() - interval '2 hours'),
        (question2_uuid, user2_uuid,
         'Python list comprehension vs traditional loops performance',
         'I have been debating whether to use list comprehensions or traditional for loops in Python. I understand that list comprehensions are more Pythonic, but I am curious about the performance implications.\n\nCan someone explain the performance differences and when each approach is more appropriate?',
         ARRAY['python', 'performance'],
         8, 156, now() - interval '4 hours'),
        (question3_uuid, user3_uuid,
         'CSS Grid vs Flexbox: When to use which?',
         'I am building a responsive layout and I am confused about when to use CSS Grid versus Flexbox. Both seem to solve similar problems, but I want to understand the best use cases for each.\n\nAny practical examples would be greatly appreciated!',
         ARRAY['css', 'grid', 'flexbox', 'responsive-design'],
         22, 445, now() - interval '6 hours');

    -- Insert sample answers
    INSERT INTO public.answers (id, question_id, author_id, content, vote_score, is_accepted) VALUES
        (answer1_uuid, question1_uuid, user3_uuid,
         'Great question! Here are the key guidelines I follow:\n\n**useState vs useReducer:**\n- Use useState for simple state (strings, numbers, booleans)\n- Use useReducer for complex state objects or when you have multiple related state variables\n\n**useEffect best practices:**\n- Always include dependencies in the dependency array\n- Clean up subscriptions and timers in the return function\n- Split effects by concern (one effect per logical operation)\n\n**Custom hooks:**\n- Extract common stateful logic into custom hooks\n- Start custom hook names with "use"\n- Return objects for multiple values instead of arrays when order does not matter\n\nHere is a simple example of a custom hook:\n\n```javascript\nfunction useCounter(initialValue = 0) {\n  const [count, setCount] = useState(initialValue);\n  const increment = () => setCount(c => c + 1);\n  const decrement = () => setCount(c => c - 1);\n  return { count, increment, decrement };\n}\n```',
         12, true),
        (answer2_uuid, question2_uuid, user1_uuid,
         'From a performance perspective, list comprehensions are generally faster than traditional loops in Python.\n\n**Why list comprehensions are faster:**\n- They are implemented in C and optimized at the language level\n- Less overhead compared to explicit for loops\n- More memory efficient for creating lists\n\n**When to use each:**\n\n**List comprehensions for:**\n- Creating new lists from existing iterables\n- Simple transformations and filtering\n- When readability is maintained\n\n**Traditional loops for:**\n- Complex logic that would make comprehensions unreadable\n- When you need to break out early\n- Side effects (printing, file operations, etc.)\n\n**Example benchmark:**\n```python\n# List comprehension (faster)\nsquares = [x**2 for x in range(1000)]\n\n# Traditional loop (slower)\nsquares = []\nfor x in range(1000):\n    squares.append(x**2)\n```\n\nThe performance difference becomes more noticeable with larger datasets.',
         9, false);

    -- Insert sample comments
    INSERT INTO public.comments (question_id, author_id, content, vote_score) VALUES
        (question1_uuid, user2_uuid, 'This is a really good question! I struggled with the same transition from class components to hooks.', 3),
        (question3_uuid, user1_uuid, 'Have you checked out the MDN documentation on CSS Grid? It has some excellent examples.', 2);

    -- Insert sample votes
    INSERT INTO public.question_votes (question_id, user_id, vote_type) VALUES
        (question1_uuid, user2_uuid, 1),
        (question1_uuid, user3_uuid, 1),
        (question2_uuid, user1_uuid, 1),
        (question2_uuid, user3_uuid, 1),
        (question3_uuid, user1_uuid, 1),
        (question3_uuid, user2_uuid, 1);

    INSERT INTO public.answer_votes (answer_id, user_id, vote_type) VALUES
        (answer1_uuid, user1_uuid, 1),
        (answer1_uuid, user2_uuid, 1),
        (answer2_uuid, user3_uuid, 1);

EXCEPTION
    WHEN foreign_key_violation THEN
        RAISE NOTICE 'Foreign key constraint violation: %', SQLERRM;
    WHEN unique_violation THEN
        RAISE NOTICE 'Unique constraint violation: %', SQLERRM;
    WHEN OTHERS THEN
        RAISE NOTICE 'Unexpected error during data insertion: %', SQLERRM;
END $$;