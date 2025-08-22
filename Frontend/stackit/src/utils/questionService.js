// import { supabase } from './supabase';

// const questionService = {
//   // Get all questions with pagination and filtering
//   getQuestions: async (options = {}) => {
//     try {
//       const {
//         limit = 10,
//         offset = 0,
//         sortBy = 'created_at',
//         sortOrder = 'desc',
//         tags = [],
//         status = 'all',
//         search = '',
//         authorId = null,
//       } = options;

//       let query = supabase
//         .from('questions')
//         .select(`
//           *,
//           author:user_profiles(id, full_name, username, avatar_url, reputation),
//           answers:answers(count),
//           question_votes(vote_type)
//         `);

//       // Apply filters
//       if (search) {
//         query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
//       }

//       if (tags.length > 0) {
//         query = query.overlaps('tags', tags);
//       }

//       if (status === 'unanswered') {
//         query = query.eq('answer_count', 0);
//       } else if (status === 'answered') {
//         query = query.gt('answer_count', 0);
//       } else if (status === 'accepted') {
//         query = query.eq('has_accepted_answer', true);
//       }

//       if (authorId) {
//         query = query.eq('author_id', authorId);
//       }

//       // Apply sorting
//       query = query.order(sortBy, { ascending: sortOrder === 'asc' });

//       // Apply pagination
//       query = query.range(offset, offset + limit - 1);

//       const { data, error } = await query;

//       if (error) {
//         return { success: false, error: error.message };
//       }

//       return { success: true, data };
//     } catch (error) {
//       if (error?.message?.includes('Failed to fetch') || 
//           error?.message?.includes('NetworkError') ||
//           error?.name === 'TypeError' && error?.message?.includes('fetch')) {
//         return { 
//           success: false, 
//           error: 'Cannot connect to database. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.' 
//         };
//       }
//       return { success: false, error: 'Failed to load questions' };
//     }
//   },

//   // Get a single question with details
//   getQuestion: async (questionId) => {
//     try {
//       const { data, error } = await supabase
//         .from('questions')
//         .select(`
//           *,
//           author:user_profiles(id, full_name, username, avatar_url, reputation),
//           answers(
//             *,
//             author:user_profiles(id, full_name, username, avatar_url, reputation),
//             answer_votes(vote_type)
//           ),
//           question_votes(vote_type),
//           comments(
//             *,
//             author:user_profiles(id, full_name, username, avatar_url)
//           )
//         `)
//         .eq('id', questionId)
//         .single();

//       if (error) {
//         return { success: false, error: error.message };
//       }

//       return { success: true, data };
//     } catch (error) {
//       if (error?.message?.includes('Failed to fetch') || 
//           error?.message?.includes('NetworkError') ||
//           error?.name === 'TypeError' && error?.message?.includes('fetch')) {
//         return { 
//           success: false, 
//           error: 'Cannot connect to database. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.' 
//         };
//       }
//       return { success: false, error: 'Failed to load question' };
//     }
//   },

//   // Create a new question
//   createQuestion: async (questionData) => {
//     try {
//       const { data, error } = await supabase
//         .from('questions')
//         .insert([questionData])
//         .select(`
//           *,
//           author:user_profiles(id, full_name, username, avatar_url, reputation)
//         `)
//         .single();

//       if (error) {
//         return { success: false, error: error.message };
//       }

//       return { success: true, data };
//     } catch (error) {
//       if (error?.message?.includes('Failed to fetch') || 
//           error?.message?.includes('NetworkError') ||
//           error?.name === 'TypeError' && error?.message?.includes('fetch')) {
//         return { 
//           success: false, 
//           error: 'Cannot connect to database. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.' 
//         };
//       }
//       return { success: false, error: 'Failed to create question' };
//     }
//   },

//   // Update a question
//   updateQuestion: async (questionId, updates) => {
//     try {
//       const { data, error } = await supabase
//         .from('questions')
//         .update({
//           ...updates,
//           updated_at: new Date().toISOString(),
//         })
//         .eq('id', questionId)
//         .select(`
//           *,
//           author:user_profiles(id, full_name, username, avatar_url, reputation)
//         `)
//         .single();

//       if (error) {
//         return { success: false, error: error.message };
//       }

//       return { success: true, data };
//     } catch (error) {
//       if (error?.message?.includes('Failed to fetch') || 
//           error?.message?.includes('NetworkError') ||
//           error?.name === 'TypeError' && error?.message?.includes('fetch')) {
//         return { 
//           success: false, 
//           error: 'Cannot connect to database. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.' 
//         };
//       }
//       return { success: false, error: 'Failed to update question' };
//     }
//   },

//   // Delete a question
//   deleteQuestion: async (questionId) => {
//     try {
//       const { error } = await supabase
//         .from('questions')
//         .delete()
//         .eq('id', questionId);

//       if (error) {
//         return { success: false, error: error.message };
//       }

//       return { success: true };
//     } catch (error) {
//       if (error?.message?.includes('Failed to fetch') || 
//           error?.message?.includes('NetworkError') ||
//           error?.name === 'TypeError' && error?.message?.includes('fetch')) {
//         return { 
//           success: false, 
//           error: 'Cannot connect to database. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.' 
//         };
//       }
//       return { success: false, error: 'Failed to delete question' };
//     }
//   },

//   // Vote on a question
//   voteQuestion: async (questionId, voteType) => {
//     try {
//       const { data: existingVote } = await supabase
//         .from('question_votes')
//         .select('*')
//         .eq('question_id', questionId)
//         .eq('user_id', (await supabase.auth.getUser()).data.user.id)
//         .single();

//       if (existingVote) {
//         // Update existing vote or remove if same vote type
//         if (existingVote.vote_type === voteType) {
//           const { error } = await supabase
//             .from('question_votes')
//             .delete()
//             .eq('id', existingVote.id);

//           if (error) {
//             return { success: false, error: error.message };
//           }
//         } else {
//           const { error } = await supabase
//             .from('question_votes')
//             .update({ vote_type: voteType })
//             .eq('id', existingVote.id);

//           if (error) {
//             return { success: false, error: error.message };
//           }
//         }
//       } else {
//         // Create new vote
//         const { error } = await supabase
//           .from('question_votes')
//           .insert([{
//             question_id: questionId,
//             user_id: (await supabase.auth.getUser()).data.user.id,
//             vote_type: voteType,
//           }]);

//         if (error) {
//           return { success: false, error: error.message };
//         }
//       }

//       return { success: true };
//     } catch (error) {
//       if (error?.message?.includes('Failed to fetch') || 
//           error?.message?.includes('NetworkError') ||
//           error?.name === 'TypeError' && error?.message?.includes('fetch')) {
//         return { 
//           success: false, 
//           error: 'Cannot connect to database. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.' 
//         };
//       }
//       return { success: false, error: 'Failed to vote on question' };
//     }
//   },

//   // Get question statistics
//   getQuestionStats: async () => {
//     try {
//       const { data: totalQuestions, error: totalError } = await supabase
//         .from('questions')
//         .select('*', { count: 'exact', head: true });

//       if (totalError) {
//         return { success: false, error: totalError.message };
//       }

//       const { data: answeredQuestions, error: answeredError } = await supabase
//         .from('questions')
//         .select('*', { count: 'exact', head: true })
//         .gt('answer_count', 0);

//       if (answeredError) {
//         return { success: false, error: answeredError.message };
//       }

//       const { data: todayQuestions, error: todayError } = await supabase
//         .from('questions')
//         .select('*', { count: 'exact', head: true })
//         .gte('created_at', new Date().toISOString().split('T')[0]);

//       if (todayError) {
//         return { success: false, error: todayError.message };
//       }

//       const { data: activeUsers, error: activeError } = await supabase
//         .from('user_profiles')
//         .select('*', { count: 'exact', head: true })
//         .gte('updated_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

//       if (activeError) {
//         return { success: false, error: activeError.message };
//       }

//       return {
//         success: true,
//         data: {
//           totalQuestions: totalQuestions || 0,
//           answeredQuestions: answeredQuestions || 0,
//           todayQuestions: todayQuestions || 0,
//           activeUsers: activeUsers || 0,
//         },
//       };
//     } catch (error) {
//       if (error?.message?.includes('Failed to fetch') || 
//           error?.message?.includes('NetworkError') ||
//           error?.name === 'TypeError' && error?.message?.includes('fetch')) {
//         return { 
//           success: false, 
//           error: 'Cannot connect to database. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.' 
//         };
//       }
//       return { success: false, error: 'Failed to load stats' };
//     }
//   },

//   // Get popular tags
//   getPopularTags: async (limit = 10) => {
//     try {
//       const { data, error } = await supabase
//         .from('tags')
//         .select('*')
//         .order('usage_count', { ascending: false })
//         .limit(limit);

//       if (error) {
//         return { success: false, error: error.message };
//       }

//       return { success: true, data };
//     } catch (error) {
//       if (error?.message?.includes('Failed to fetch') || 
//           error?.message?.includes('NetworkError') ||
//           error?.name === 'TypeError' && error?.message?.includes('fetch')) {
//         return { 
//           success: false, 
//           error: 'Cannot connect to database. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.' 
//         };
//       }
//       return { success: false, error: 'Failed to load tags' };
//     }
//   },
// };

// export default questionService;