

"use client";
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useState, useEffect } from "react";

// Type definitions
interface TopicConversation {
  topicId: string;
  title: string;
  description: string;
  status: 'Active' | 'Inactive';
  createdAt: string;
}

const sampleTopics: TopicConversation[] = [
  {
    topicId: "TC001",
    title: "Business Meetings",
    description: "Professional conversations for business meetings, presentations, and negotiations",
    status: "Active",
    createdAt: "2024-01-15"
  },
  {
    topicId: "TC002",
    title: "Travel & Tourism",
    description: "Conversations about travel planning, booking, and tourist experiences",
    status: "Active",
    createdAt: "2024-01-20"
  },
  {
    topicId: "TC003",
    title: "Daily Life Conversations",
    description: "Everyday conversations including shopping, dining, and social interactions",
    status: "Active",
    createdAt: "2024-02-05"
  },
  {
    topicId: "TC004",
    title: "Job Interviews",
    description: "Professional interview conversations and workplace communication",
    status: "Active",
    createdAt: "2024-02-12"
  },
  {
    topicId: "TC005",
    title: "Academic Discussions",
    description: "Educational conversations for academic settings and research discussions",
    status: "Active",
    createdAt: "2024-02-18"
  },
  {
    topicId: "TC006",
    title: "Healthcare Conversations",
    description: "Medical conversations between patients and healthcare professionals",
    status: "Inactive",
    createdAt: "2024-03-01"
  },
  {
    topicId: "TC007",
    title: "Technology & Innovation",
    description: "Discussions about technology trends, digital transformation, and innovation",
    status: "Active",
    createdAt: "2024-03-10"
  },
  {
    topicId: "TC008",
    title: "Cultural Exchange",
    description: "Conversations about different cultures, traditions, and cultural experiences",
    status: "Active",
    createdAt: "2024-03-15"
  }
];

const TopicConversationManagement = () => {
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [search, setSearch] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [selectedTopic, setSelectedTopic] = useState<TopicConversation | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false);
  const [actionType, setActionType] = useState<'delete'>('delete');
  const [topicToAction, setTopicToAction] = useState<TopicConversation | null>(null);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  // Filter topics
  const filteredTopics = sampleTopics.filter(topic => {
    const matchesSearch = topic.title.toLowerCase().includes(search.toLowerCase()) ||
                         topic.topicId.toLowerCase().includes(search.toLowerCase()) ||
                         topic.description.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || topic.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleSelectRow = (idx: number) => {
    setSelectedRows(selectedRows.includes(idx)
      ? selectedRows.filter(i => i !== idx)
      : [...selectedRows, idx]);
  };

  const handleSelectAll = () => {
    if (selectedRows.length === filteredTopics.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(filteredTopics.map((_, idx) => idx));
    }
  };

  const handleEditTopic = (topic: TopicConversation) => {
    setSelectedTopic(topic);
    setShowEditModal(true);
  };

  const handleAction = (topic: TopicConversation, action: 'delete') => {
    setTopicToAction(topic);
    setActionType(action);
    setShowConfirmDialog(true);
  };

  const confirmAction = () => {
    console.log(`${actionType}ing topic:`, topicToAction);
    setShowConfirmDialog(false);
    setTopicToAction(null);
  };

  // Close dropdown when clicking outside
  const handleClickOutside = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!target.closest('.dropdown-container')) {
      setOpenDropdownId(null);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
          </Button>
          <Input
            placeholder="Search topics..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-[300px]"
          />
          <select 
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 border rounded-md cursor-pointer"
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
        <Button 
          onClick={() => setShowCreateModal(true)}
          className="bg-green-600 text-white font-semibold px-4 py-2 rounded-lg shadow hover:bg-green-700 cursor-pointer"
        >
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="inline mr-2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 8v8M8 12h8"/>
          </svg>
          Add Topic
        </Button>
      </div>
      
      <div className="overflow-x-auto rounded-xl border shadow">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#f7f9fa]">
              <TableHead>
                <Checkbox
                  checked={selectedRows.length === filteredTopics.length && filteredTopics.length > 0}
                  onCheckedChange={handleSelectAll}
                  aria-label="Select all"
                />
              </TableHead>
              <TableHead>Topic ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created Date</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTopics.map((topic, idx) => (
              <TableRow key={topic.topicId} className="hover:bg-[#f0f7e6]">
                <TableCell>
                  <Checkbox
                    checked={selectedRows.includes(idx)}
                    onCheckedChange={() => handleSelectRow(idx)}
                    aria-label={`Select row ${idx}`}
                  />
                </TableCell>
                <TableCell className="font-medium text-blue-600">{topic.topicId}</TableCell>
                <TableCell className="font-medium">
                  {topic.title}
                </TableCell>
                <TableCell className="text-gray-600 max-w-[300px] truncate" title={topic.description}>
                  {topic.description}
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={topic.status === "Active" ? "default" : "secondary"}
                    className={topic.status === "Active" ? "bg-green-600 text-white" : "bg-red-400 text-white"}
                  >
                    {topic.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-gray-600">
                  {new Date(topic.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-center">
                  <div className="relative dropdown-container">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setOpenDropdownId(openDropdownId === topic.topicId ? null : topic.topicId)}
                      className="p-1 h-8 w-8 cursor-pointer"
                    >
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="1"/>
                        <circle cx="19" cy="12" r="1"/>
                        <circle cx="5" cy="12" r="1"/>
                      </svg>
                    </Button>
                    
                    {openDropdownId === topic.topicId && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border z-10">
                        <div className="py-1">
                          <button
                            onClick={() => {
                              handleEditTopic(topic);
                              setOpenDropdownId(null);
                            }}
                            className="block cursor-pointer w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-gray-100"
                          >
                            <svg width="16" height="16" className="inline mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                              <path d="m18.5 2.5 a 2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                            </svg>
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              handleAction(topic, 'delete');
                              setOpenDropdownId(null);
                            }}
                            className="block cursor-pointer w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                          >
                            <svg width="16" height="16" className="inline mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path d="M3 6h18"/>
                              <path d="M8 6v12a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V6"/>
                            </svg>
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {/* Pagination & Info */}
      <div className="flex items-center justify-between text-sm text-gray-500 mt-4">
        <div>
          ACTIVE TOPICS: {filteredTopics.filter(t => t.status === "Active").length}/{filteredTopics.length} | 
          TOTAL TOPICS: {filteredTopics.length}
        </div>
        <div>Rows per page: <span className="font-semibold">10</span> &nbsp; 1-10 of {filteredTopics.length}</div>
      </div>

      {/* Add Topic Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl max-h-[90vh] overflow-y-auto w-full mx-4">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">Add New Topic</h2>
                <Button 
                  variant="ghost" 
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-500 hover:text-gray-700 cursor-pointer"
                >
                  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M18 6L6 18M6 6l12 12"/>
                  </svg>
                </Button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Title *</label>
                  <Input 
                    placeholder="e.g., Business Conversations" 
                    className="w-full"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Description *</label>
                  <textarea 
                    placeholder="Describe the conversation topic and its purpose..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={4}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Status *</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

                <div className="flex gap-3 justify-end pt-6 border-t">
                  <Button 
                    type="button"
                    variant="outline" 
                    onClick={() => setShowCreateModal(false)} 
                    className="cursor-pointer"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 cursor-pointer"
                  >
                    Create Topic
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Topic Modal */}
      {showEditModal && selectedTopic && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl max-h-[90vh] overflow-y-auto w-full mx-4">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">Edit Topic</h2>
                <Button 
                  variant="ghost" 
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-500 hover:text-gray-700 cursor-pointer"
                >
                  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M18 6L6 18M6 6l12 12"/>
                  </svg>
                </Button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Topic ID</label>
                  <Input 
                    value={selectedTopic.topicId}
                    className="w-full bg-gray-100"
                    disabled
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Title *</label>
                  <Input 
                    defaultValue={selectedTopic.title}
                    className="w-full"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Description *</label>
                  <textarea 
                    defaultValue={selectedTopic.description}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={4}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Status *</label>
                  <select 
                    defaultValue={selectedTopic.status}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    required
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Created Date</label>
                  <Input 
                    value={selectedTopic.createdAt}
                    className="w-full bg-gray-100"
                    disabled
                  />
                </div>

                <div className="flex gap-3 justify-end pt-6 border-t">
                  <Button 
                    type="button"
                    variant="outline" 
                    onClick={() => setShowEditModal(false)} 
                    className="cursor-pointer"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
                  >
                    Update Topic
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Dialog */}
      {showConfirmDialog && topicToAction && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
            <h3 className="text-lg font-semibold mb-4">
              Confirm Delete Topic
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete <strong>{topicToAction.title}</strong>? 
              This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <Button 
                variant="outline" 
                onClick={() => setShowConfirmDialog(false)} 
                className="cursor-pointer"
              >
                Cancel
              </Button>
              <Button 
                onClick={confirmAction}
                className="bg-red-600 hover:bg-red-700 cursor-pointer"
              >
                Delete Topic
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TopicConversationManagement;
