import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Header from '../../components/ui/Header';
import questionService from '../../utils/questionService';

import FilterChips from './components/FilterChips';
import QuestionsList from './components/QuestionsList';
import StatsOverview from './components/StatsOverview';
import QuickActions from './components/QuickActions';
import Button from '../../components/ui/Button';

const QuestionsDashboard = () => {
  const location = useLocation();
  const { getCurrentUser, loading: authLoading } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedSort, setSelectedSort] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState({
    totalQuestions: 0,
    answeredQuestions: 0,
    activeUsers: 0,
    todayQuestions: 0
  });

    const [user, setUser] = useState('');
    const token = localStorage.getItem('token')
    
    // Check if user is authenticated
    useEffect( async () => {
      const newUser = await getCurrentUser(token);
      setUser(newUser)
      console.log(user)
    }, []);

  // Parse URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const search = urlParams.get('search') || '';
    const tag = urlParams.get('tag') || '';
    const filter = urlParams.get('filter') || '';

    setSearchQuery(search);
    
    if (tag) {
      setSelectedTags([tag]);
    }
    
    if (filter === 'my-questions' || filter === 'my-answers' || filter === 'bookmarks') {
      setSelectedStatus(filter);
    }
  }, [location.search]);

  // Load initial data
  useEffect(() => {
    if (!authLoading) {
      loadQuestions();
      loadStats();
    }
  }, [selectedTags, selectedStatus, selectedSort, searchQuery, authLoading]);

  const loadQuestions = useCallback(async () => {
    setLoading(true);
    
    try {
      const options = {
        limit: 20,
        offset: 0,
        sortBy: selectedSort === 'newest' ? 'created_at' : 
               selectedSort === 'votes' ? 'vote_score' : 
               selectedSort === 'answers' ? 'answer_count' : 'view_count',
        sortOrder: 'desc',
        tags: selectedTags,
        status: selectedStatus === 'all' ? undefined : selectedStatus,
        search: searchQuery,
        authorId: selectedStatus === 'my-questions' ? user?.id : null,
      };

      const result = await questionService.getQuestions(options);
      
      if (result?.success) {
        setQuestions(result.data || []);
        setHasMore((result.data || []).length >= 20);
      } else {
        console.log('Failed to load questions:', result?.error);
        setQuestions([]);
      }
    } catch (error) {
      console.log('Error loading questions:', error);
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  }, [selectedTags, selectedStatus, selectedSort, searchQuery, user?.id]);

  const loadStats = useCallback(async () => {
    try {
      const result = await questionService.getQuestionStats();
      
      if (result?.success) {
        setStats(result.data);
      } else {
        console.log('Failed to load stats:', result?.error);
      }
    } catch (error) {
      console.log('Error loading stats:', error);
    }
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadQuestions();
    await loadStats();
    setRefreshing(false);
  };

  const handleLoadMore = async () => {
    setLoading(true);
    
    try {
      const options = {
        limit: 20,
        offset: questions.length,
        sortBy: selectedSort === 'newest' ? 'created_at' : 
               selectedSort === 'votes' ? 'vote_score' : 
               selectedSort === 'answers' ? 'answer_count' : 'view_count',
        sortOrder: 'desc',
        tags: selectedTags,
        status: selectedStatus === 'all' ? undefined : selectedStatus,
        search: searchQuery,
        authorId: selectedStatus === 'my-questions' ? user?.id : null,
      };

      const result = await questionService.getQuestions(options);
      
      if (result?.success) {
        const newQuestions = result.data || [];
        setQuestions(prev => [...prev, ...newQuestions]);
        setHasMore(newQuestions.length >= 20);
      }
    } catch (error) {
      console.log('Error loading more questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuestionClick = (questionId) => {
    window.location.href = `/question-detail-answers?id=${questionId}`;
  };

  const handleTagClick = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleUserClick = (userId) => {
    window.location.href = `/user-profile?id=${userId}`;
  };

  const handleStatusFilter = (status) => {
    setSelectedStatus(status);
  };

  const handleSortChange = (sort) => {
    setSelectedSort(sort);
  };

  const handleClearFilters = () => {
    setSelectedTags([]);
    setSelectedStatus('all');
    setSelectedSort('newest');
    setSearchQuery('');
    window.history.pushState({}, '', '/questions-dashboard');
  };

  const handleAskQuestion = () => {
    if (!user) {
      window.location.href = '/user-registration';
      return;
    }
    window.location.href = '/ask-question';
  };

  // Show loading state during auth initialization
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-6 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Questions Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Discover, learn, and share knowledge with our community
            </p>
          </div>
          
          {/* Desktop Ask Question Button */}
          <div className="hidden md:block">
            <Button
              variant="default"
              onClick={handleAskQuestion}
              iconName="Plus"
              iconPosition="left"
              size="lg"
            >
              Ask Question
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <StatsOverview stats={stats} />

        {/* Quick Actions */}
        <QuickActions 
          onAskQuestion={handleAskQuestion}
          onRefresh={handleRefresh}
          isRefreshing={refreshing}
        />

        {/* Filters */}
        <FilterChips
          selectedTags={selectedTags}
          selectedStatus={selectedStatus}
          selectedSort={selectedSort}
          onTagFilter={handleTagClick}
          onStatusFilter={handleStatusFilter}
          onSortChange={handleSortChange}
          onClearFilters={handleClearFilters}
        />

        {/* Questions List */}
        <QuestionsList
          questions={questions}
          loading={loading}
          hasMore={hasMore}
          onLoadMore={handleLoadMore}
          onQuestionClick={handleQuestionClick}
          onTagClick={handleTagClick}
          onUserClick={handleUserClick}
          searchQuery={searchQuery}
        />
      </main>

      {/* Mobile Floating Action Button */}
      <div className="md:hidden fixed bottom-6 right-6 z-40">
        <Button
          variant="default"
          size="lg"
          onClick={handleAskQuestion}
          iconName="Plus"
          iconSize={20}
          className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300"
        />
      </div>
    </div>
  );
};

export default QuestionsDashboard;