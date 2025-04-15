
import React from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/context/AuthContext';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';

const SettingsPage = () => {
  const { currentUser, logout, isAdmin } = useAuth();
  const { toast } = useToast();
  
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Profile Updated",
      description: "Your profile information has been updated successfully.",
    });
  };
  
  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Password Updated",
      description: "Your password has been changed successfully.",
    });
  };
  
  const handleSaveNotifications = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Notification Settings Saved",
      description: "Your notification preferences have been updated.",
    });
  };
  
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>
        
        <Tabs defaultValue="profile" className="space-y-4">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your personal details and profile information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="h-16 w-16 rounded-full bg-educate-100 flex items-center justify-center text-xl font-semibold text-educate-600">
                      {currentUser?.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium">{currentUser?.name}</p>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{currentUser?.role}</Badge>
                        <Badge variant="secondary">
                          {currentUser?.school}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" defaultValue={currentUser?.name} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" defaultValue={currentUser?.email} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" placeholder="Your phone number" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="school">School</Label>
                      <Input id="school" defaultValue={currentUser?.school} readOnly />
                    </div>
                  </div>
                  
                  {isAdmin ? null : (
                    <div className="space-y-2">
                      <Label htmlFor="subjects">Subjects (Assigned by Admin)</Label>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {currentUser?.subjects.map((subject) => (
                          <Badge key={subject} variant="secondary">
                            {subject}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </form>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={logout}>Sign Out</Button>
                <Button onClick={handleSaveProfile} className="bg-educate-400 hover:bg-educate-500">Save Changes</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="password" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>
                  Update your password to keep your account secure
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSavePassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input id="current-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input id="confirm-password" type="password" />
                  </div>
                </form>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSavePassword} className="bg-educate-400 hover:bg-educate-500">
                  Update Password
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>
                  Manage how you receive notifications and updates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSaveNotifications} className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="email-notif">Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive notifications via email
                        </p>
                      </div>
                      <Switch id="email-notif" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="paper-updates">Paper Updates</Label>
                        <p className="text-sm text-muted-foreground">
                          Get notified when question papers are updated
                        </p>
                      </div>
                      <Switch id="paper-updates" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="question-updates">Question Bank Updates</Label>
                        <p className="text-sm text-muted-foreground">
                          Get notified when new questions are added
                        </p>
                      </div>
                      <Switch id="question-updates" />
                    </div>
                    
                    {isAdmin && (
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="teacher-updates">Teacher Activity</Label>
                          <p className="text-sm text-muted-foreground">
                            Get notified about teacher activities
                          </p>
                        </div>
                        <Switch id="teacher-updates" defaultChecked />
                      </div>
                    )}
                  </div>
                </form>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveNotifications} className="bg-educate-400 hover:bg-educate-500">
                  Save Preferences
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default SettingsPage;
