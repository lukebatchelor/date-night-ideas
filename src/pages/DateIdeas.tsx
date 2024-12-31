import React, { useState, useEffect } from 'react';
import { Plus, ThumbsUp, ThumbsDown, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent,
  CardFooter 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

type DateIdea = {
  id?: string;
  text: string;
  letter: string;
  votes?: number;
  comments?: number;
  hasVoted?: boolean;
};

type DateIdeasByLetter = {
  [key: string]: string[];
};

export const DateIdeasPage = () => {
  const [dateIdeas, setDateIdeas] = useState<DateIdeasByLetter>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const alphabet = '#ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  useEffect(() => {
    const loadDateIdeas = async () => {
      try {
        const response = await fetch('/date-ideas.json');
        if (!response.ok) {
          throw new Error('Failed to fetch date ideas');
        }
        const data = await response.json();
        setDateIdeas(data.dateIdeas);
        setLoading(false);
      } catch (err) {
        setError('Failed to load date ideas');
        setLoading(false);
      }
    };

    loadDateIdeas();
  }, []);

  const scrollToLetter = (letter: string) => {
    const element = document.getElementById(`section-${letter}`);
    if (element) {
      const offset = 80; // Adjust for sticky header
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth'
      });
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Date Ideas</h1>
        <Button size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Idea
        </Button>
      </div>

      {/* Letter Jump Navigation */}
      <div className="sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10 border-b">
        <div className="flex flex-wrap gap-1 py-2">
          {alphabet.map((letter) => (
            <Button
              key={letter}
              variant="ghost"
              size="sm"
              className="w-8 h-8 p-0"
              onClick={() => scrollToLetter(letter)}
              disabled={!dateIdeas[letter]}
            >
              {letter}
            </Button>
          ))}
        </div>
      </div>

      {/* Ideas List */}
      <div className="space-y-8 pb-24">
        {Object.entries(dateIdeas).map(([letter, ideas]) => (
          <section key={letter} id={`section-${letter}`} className="space-y-4">
            <h2 className="text-xl font-semibold sticky top-20 bg-background py-2 z-[5]">
              {letter}
            </h2>
            <div className="grid gap-3">
              {ideas.map((idea) => (
                <Card key={idea}>
                  <div className="flex items-center justify-between p-3">
                    <p className="text-sm">{idea}</p>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <ThumbsUp className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <ThumbsDown className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MessageSquare className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};