// import { supabase } from './supabase';

// const answerService = {
//   // Create a new answer
//   createAnswer: async (answerData) => {
//     try {
//       const { data, error } = await supabase
//         .from('answers')
//         .insert([answerData])
//         .select(`
//           *,
//           author:user_profiles(id, full_name, username, avatar_url, reputation),
//           answer_votes(vote_type)
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
//       return { success: false, error: 'Failed to create answer' };
//     }
//   },

//   // Update an answer
//   updateAnswer: async (answerId, updates) => {
//     try {
//       const { data, error } = await supabase
//         .from('answers')
//         .update({
//           ...updates,
//           updated_at: new Date().toISOString(),
//         })
//         .eq('id', answerId)
//         .select(`
//           *,
//           author:user_profiles(id, full_name, username, avatar_url, reputation),
//           answer_votes(vote_type)
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
//       return { success: false, error: 'Failed to update answer' };
//     }
//   },

//   // Delete an answer
//   deleteAnswer: async (answerId) => {
//     try {
//       const { error } = await supabase
//         .from('answers')
//         .delete()
//         .eq('id', answerId);

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
//       return { success: false, error: 'Failed to delete answer' };
//     }
//   },

//   // Vote on an answer
//   voteAnswer: async (answerId, voteType) => {
//     try {
//       const { data: existingVote } = await supabase
//         .from('answer_votes')
//         .select('*')
//         .eq('answer_id', answerId)
//         .eq('user_id', (await supabase.auth.getUser()).data.user.id)
//         .single();

//       if (existingVote) {
//         // Update existing vote or remove if same vote type
//         if (existingVote.vote_type === voteType) {
//           const { error } = await supabase
//             .from('answer_votes')
//             .delete()
//             .eq('id', existingVote.id);

//           if (error) {
//             return { success: false, error: error.message };
//           }
//         } else {
//           const { error } = await supabase
//             .from('answer_votes')
//             .update({ vote_type: voteType })
//             .eq('id', existingVote.id);

//           if (error) {
//             return { success: false, error: error.message };
//           }
//         }
//       } else {
//         // Create new vote
//         const { error } = await supabase
//           .from('answer_votes')
//           .insert([{
//             answer_id: answerId,
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
//       return { success: false, error: 'Failed to vote on answer' };
//     }
//   },

//   // Accept an answer
//   acceptAnswer: async (answerId) => {
//     try {
//       const { data, error } = await supabase
//         .from('answers')
//         .update({ is_accepted: true })
//         .eq('id', answerId)
//         .select(`
//           *,
//           author:user_profiles(id, full_name, username, avatar_url, reputation),
//           answer_votes(vote_type)
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
//       return { success: false, error: 'Failed to accept answer' };
//     }
//   },

//   // Get answers for a question
//   getAnswers: async (questionId, options = {}) => {
//     try {
//       const {
//         sortBy = 'created_at',
//         sortOrder = 'desc',
//       } = options;

//       let query = supabase
//         .from('answers')
//         .select(`
//           *,
//           author:user_profiles(id, full_name, username, avatar_url, reputation),
//           answer_votes(vote_type),
//           comments(
//             *,
//             author:user_profiles(id, full_name, username, avatar_url)
//           )
//         `)
//         .eq('question_id', questionId);

//       // Apply sorting (accepted answers first)
//       query = query.order('is_accepted', { ascending: false });
//       query = query.order(sortBy, { ascending: sortOrder === 'asc' });

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
//       return { success: false, error: 'Failed to load answers' };
//     }
//   },
// };

// export default answerService;