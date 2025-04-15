
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Users, FileText, BookOpenCheck } from 'lucide-react';
import { useData } from '@/context/DataContext';

export const SchoolOverview = () => {
  const { questionPapers } = useData();
  
  const statCards = [
    {
      title: "Teachers",
      value: "5",
      description: "Active teachers",
      icon: Users,
      color: "text-blue-500",
      bgColor: "bg-blue-50",
    },
    {
      title: "Subjects",
      value: "12",
      description: "Different subjects",
      icon: BookOpen,
      color: "text-green-500",
      bgColor: "bg-green-50",
    },
    {
      title: "Question Papers",
      value: questionPapers.length.toString(),
      description: "Created this year",
      icon: FileText,
      color: "text-amber-500",
      bgColor: "bg-amber-50",
    },
    {
      title: "Question Bank",
      value: "250+",
      description: "Questions in bank",
      icon: BookOpenCheck,
      color: "text-purple-500",
      bgColor: "bg-purple-50",
    }
  ];
  
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {card.title}
              </CardTitle>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground">{card.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>School Performance</CardTitle>
          <CardDescription>
            Overview of academic metrics and question paper usage
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <p className="text-center text-gray-500">
            Detailed analytics coming soon
          </p>
        </CardContent>
      </Card>
    </>
  );
};
