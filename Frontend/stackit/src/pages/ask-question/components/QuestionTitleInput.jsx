import React from 'react';
import Input from '../../../components/ui/Input';

const QuestionTitleInput = ({ title, onChange, error, maxLength = 150 }) => {
  const remainingChars = maxLength - title.length;
  
  return (
    <div className="space-y-2">
      <Input
        label="Question Title"
        type="text"
        placeholder="What's your programming question? Be specific and clear."
        value={title}
        onChange={(e) => onChange(e.target.value)}
        error={error}
        required
        maxLength={maxLength}
        className="text-lg"
      />
      <div className="flex justify-between items-center text-sm">
        <p className="text-muted-foreground">
          Write a clear, specific title that summarizes your question
        </p>
        <span className={`text-xs ${remainingChars < 20 ? 'text-warning' : 'text-muted-foreground'}`}>
          {remainingChars} characters remaining
        </span>
      </div>
    </div>
  );
};

export default QuestionTitleInput;