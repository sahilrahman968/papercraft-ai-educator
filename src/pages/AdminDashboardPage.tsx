
import React from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TeacherManagement } from '@/components/admin/TeacherManagement';
import { SchoolOverview } from '@/components/admin/SchoolOverview';

const AdminDashboardPage = () => {
  const { currentUser } = useAuth();

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {currentUser?.name}
          </p>
        </div>
        
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">School Overview</TabsTrigger>
            <TabsTrigger value="teachers">Teacher Management</TabsTrigger>
            <TabsTrigger value="papers">Question Papers</TabsTrigger>
            <TabsTrigger value="settings">School Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <SchoolOverview />
          </TabsContent>
          
          <TabsContent value="teachers" className="space-y-4">
            <TeacherManagement />
          </TabsContent>
          
          <TabsContent value="papers" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>All Question Papers</CardTitle>
                <CardDescription>
                  View and manage all question papers created by teachers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center py-8 text-gray-500">
                  Feature coming soon
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>School Settings</CardTitle>
                <CardDescription>
                  Manage your school's configuration and preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center py-8 text-gray-500">
                  Feature coming soon
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AdminDashboardPage;
