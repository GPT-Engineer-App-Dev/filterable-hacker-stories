import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

function Index() {
  const [stories, setStories] = useState([]);
  const [filteredStories, setFilteredStories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const fetchTopStories = async () => {
      try {
        const topStories = await axios.get('https://hacker-news.firebaseio.com/v0/topstories.json');
        const topFiveStoryIds = topStories.data.slice(0, 5);
        const storyPromises = topFiveStoryIds.map(id => axios.get(`https://hacker-news.firebaseio.com/v0/item/${id}.json`));
        const storyResponses = await Promise.all(storyPromises);
        const storiesData = storyResponses.map(response => response.data);
        setStories(storiesData);
        setFilteredStories(storiesData);
      } catch (error) {
        console.error('Error fetching top stories:', error);
      }
    };

    fetchTopStories();
  }, []);

  useEffect(() => {
    const filtered = stories.filter(story => story.title.toLowerCase().includes(searchTerm.toLowerCase()));
    setFilteredStories(filtered);
  }, [searchTerm, stories]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="flex justify-between items-center p-4">
        <Input
          type="text"
          placeholder="Search stories..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full max-w-md"
        />
        <div className="flex items-center ml-4">
          <span className="mr-2">Dark Mode</span>
          <Switch checked={darkMode} onCheckedChange={toggleDarkMode} />
        </div>
      </div>
      <div className="p-4">
        {filteredStories.map(story => (
          <Card key={story.id} className="mb-4">
            <CardHeader>
              <CardTitle>{story.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Upvotes: {story.score}</p>
              <a href={story.url} target="_blank" rel="noopener noreferrer" className="text-blue-500">Read more</a>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default Index;