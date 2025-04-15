
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, Plus, X, Check, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { v4 as uuidv4 } from 'uuid'; // We'll implement a similar function without the package

// Mock function to generate unique IDs
const generateId = () => `t-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

const SUBJECTS = [
  'Mathematics', 'Science', 'English', 'History', 'Geography', 
  'Physics', 'Chemistry', 'Biology', 'Computer Science', 'Art',
  'Music', 'Physical Education'
];

// Mock teacher data
const MOCK_TEACHERS = [
  {
    id: 'user1',
    name: 'Mr. John Doe',
    email: 'john.doe@example.edu',
    role: 'Teacher' as const,
    school: 'Springfield High School',
    subjects: ['Biology', 'Chemistry'],
  },
  {
    id: 'user2',
    name: 'Ms. Jane Smith',
    email: 'jane.smith@example.edu',
    role: 'Teacher' as const,
    school: 'Springfield High School',
    subjects: ['Mathematics', 'Computer Science'],
  },
  {
    id: 'user3',
    name: 'Dr. Robert Johnson',
    email: 'robert.johnson@example.edu',
    role: 'Teacher' as const,
    school: 'Springfield High School',
    subjects: ['Physics'],
  },
];

export const TeacherManagement = () => {
  const [teachers, setTeachers] = useState(MOCK_TEACHERS);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newTeacher, setNewTeacher] = useState({
    name: '',
    email: '',
    phone: '',
    subjects: [] as string[],
  });
  
  const { toast } = useToast();
  
  const handleAddTeacher = () => {
    if (!newTeacher.name || !newTeacher.email || newTeacher.subjects.length === 0) {
      toast({
        title: "Invalid Input",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }
    
    // Check if email already exists
    if (teachers.some(t => t.email === newTeacher.email)) {
      toast({
        title: "Email already exists",
        description: "A teacher with this email is already registered",
        variant: "destructive",
      });
      return;
    }
    
    const teacher = {
      id: generateId(),
      name: newTeacher.name,
      email: newTeacher.email,
      role: 'Teacher' as const,
      school: 'Springfield High School',
      subjects: newTeacher.subjects,
    };
    
    setTeachers([...teachers, teacher]);
    
    toast({
      title: "Teacher Added",
      description: `${teacher.name} has been added successfully`,
    });
    
    // Reset form and close dialog
    setNewTeacher({
      name: '',
      email: '',
      phone: '',
      subjects: [],
    });
    setIsAddDialogOpen(false);
  };
  
  const handleRemoveTeacher = (id: string) => {
    setTeachers(teachers.filter(t => t.id !== id));
    
    toast({
      title: "Teacher Removed",
      description: "The teacher has been removed successfully",
    });
  };
  
  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Teacher Management</CardTitle>
            <CardDescription>Add, edit or remove teachers from your school</CardDescription>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-educate-400 hover:bg-educate-500">
                <Plus className="mr-1 h-4 w-4" />
                Add Teacher
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add New Teacher</DialogTitle>
                <DialogDescription>
                  Add a new teacher to your school. They will be able to sign in using the provided email.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g. John Doe"
                    value={newTeacher.name}
                    onChange={(e) => setNewTeacher({ ...newTeacher, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="teacher.name@school.edu"
                    value={newTeacher.email}
                    onChange={(e) => setNewTeacher({ ...newTeacher, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number (Optional)</Label>
                  <Input
                    id="phone"
                    placeholder="+1 123 456 7890"
                    value={newTeacher.phone}
                    onChange={(e) => setNewTeacher({ ...newTeacher, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Assigned Subjects</Label>
                  <Select
                    onValueChange={(value) => {
                      if (!newTeacher.subjects.includes(value)) {
                        setNewTeacher({
                          ...newTeacher,
                          subjects: [...newTeacher.subjects, value],
                        });
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {SUBJECTS.map((subject) => (
                        <SelectItem key={subject} value={subject}>
                          {subject}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  {newTeacher.subjects.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {newTeacher.subjects.map((subject) => (
                        <div 
                          key={subject} 
                          className="bg-gray-100 px-2 py-1 rounded-full text-sm flex items-center"
                        >
                          {subject}
                          <button
                            className="ml-1 text-gray-500 hover:text-red-500"
                            onClick={() => {
                              setNewTeacher({
                                ...newTeacher,
                                subjects: newTeacher.subjects.filter(s => s !== subject),
                              });
                            }}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button className="bg-educate-400 hover:bg-educate-500" onClick={handleAddTeacher}>
                  Add Teacher
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {teachers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <User className="h-12 w-12 mx-auto text-gray-300 mb-2" />
              <p>No teachers added yet</p>
              <p className="text-sm">Click the "Add Teacher" button to add your first teacher</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Subjects</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teachers.map((teacher) => (
                  <TableRow key={teacher.id}>
                    <TableCell className="font-medium">{teacher.name}</TableCell>
                    <TableCell>{teacher.email}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {teacher.subjects.map((subject) => (
                          <span 
                            key={subject} 
                            className="bg-gray-100 px-2 py-0.5 rounded-full text-xs"
                          >
                            {subject}
                          </span>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="text-gray-500">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-500"
                        onClick={() => handleRemoveTeacher(teacher.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </>
  );
};
