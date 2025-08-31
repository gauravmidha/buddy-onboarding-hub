'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import {
  Star,
  Send,
  Calendar,
  User,
  MessageSquare,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { api } from '@/lib/api';
import { FeedbackSurvey as FeedbackSurveyType, FeedbackQuestion, FeedbackResponse } from '@/types';

interface FeedbackSurveyProps {
  survey: FeedbackSurveyType | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: () => void;
}

export const FeedbackSurvey = ({ survey, isOpen, onClose, onSubmit }: FeedbackSurveyProps) => {
  const [questions, setQuestions] = useState<FeedbackQuestion[]>([]);
  const [responses, setResponses] = useState<Record<string, number>>({});
  const [comments, setComments] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && survey) {
      loadQuestions();
    }
  }, [isOpen, survey]);

  const loadQuestions = async () => {
    try {
      setLoading(true);
      const data = await api.getFeedbackQuestions();
      setQuestions(data as any[]);
    } catch (error) {
      console.error('Failed to load feedback questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRatingChange = (questionId: string, rating: number) => {
    setResponses(prev => ({ ...prev, [questionId]: rating }));
  };

  const handleSubmit = async () => {
    if (!survey) return;

    try {
      setSubmitting(true);

      const feedbackResponses: FeedbackResponse[] = questions
        .filter(q => q.type === 'rating')
        .map(q => ({
          question_id: q.id,
          question_text: q.text,
          answer: responses[q.id] || 0,
          category: q.category
        }));

      await api.submitFeedbackSurvey(survey.id, feedbackResponses, comments);

      if (onSubmit) {
        onSubmit();
      }

      onClose();
    } catch (error) {
      console.error('Failed to submit feedback:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const getProgress = () => {
    const ratingQuestions = questions.filter(q => q.type === 'rating');
    const answeredCount = ratingQuestions.filter(q => responses[q.id]).length;
    return (answeredCount / ratingQuestions.length) * 100;
  };

  const getSurveyTitle = () => {
    if (!survey) return '';
    switch (survey.type) {
      case 'day-30':
        return 'Day 30 Check-in Survey';
      case 'day-90':
        return 'Day 90 Check-in Survey';
      case 'ad-hoc':
        return 'Feedback Survey';
      default:
        return 'Survey';
    }
  };

  const getSurveyDescription = () => {
    if (!survey) return '';
    switch (survey.type) {
      case 'day-30':
        return 'Thank you for completing 30 days with us! Your feedback helps us improve the onboarding experience.';
      case 'day-90':
        return 'You\'ve been with us for 90 days! Help us understand your experience and how we can continue supporting you.';
      case 'ad-hoc':
        return 'We value your feedback. Please take a few minutes to share your thoughts.';
      default:
        return '';
    }
  };

  if (loading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <MessageSquare className="w-5 h-5 text-blue-600" />
            <span>{getSurveyTitle()}</span>
          </DialogTitle>
          <div className="text-sm text-gray-600 dark:text-gray-300 mt-2">
            {getSurveyDescription()}
          </div>
        </DialogHeader>

        {survey && (
          <div className="space-y-6">
            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{Math.round(getProgress())}%</span>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                <div
                  className="bg-[#e99f75] h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.round(getProgress())}%` }}
                ></div>
              </div>
            </div>

            {/* Survey Questions */}
            <div className="space-y-6">
              {questions.filter(q => q.type === 'rating').map((question, index) => (
                <Card key={question.id} className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-xs font-medium text-blue-600 dark:text-blue-400">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                          {question.text}
                        </h4>
                        <div className="flex items-center space-x-1">
                          {[1, 2, 3, 4, 5].map((rating) => (
                            <button
                              key={rating}
                              onClick={() => handleRatingChange(question.id, rating)}
                              className={cn(
                                'p-2 rounded-lg transition-all duration-200 hover:scale-110',
                                responses[question.id] === rating
                                  ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'
                                  : 'bg-gray-100 dark:bg-gray-700 text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                              )}
                            >
                              <Star
                                className={cn(
                                  'w-5 h-5',
                                  responses[question.id] === rating ? 'fill-current' : ''
                                )}
                              />
                            </button>
                          ))}
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>Strongly Disagree</span>
                          <span>Strongly Agree</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}

              {/* Comments Section */}
              <Card className="p-4">
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <MessageSquare className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                        Additional Comments (Optional)
                      </h4>
                      <Textarea
                        value={comments}
                        onChange={(e) => setComments(e.target.value)}
                        placeholder="Share any additional thoughts, suggestions, or concerns..."
                        className="min-h-[80px] resize-none"
                      />
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button
                variant="outline"
                onClick={onClose}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={submitting || getProgress() < 100}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Submit Feedback
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
