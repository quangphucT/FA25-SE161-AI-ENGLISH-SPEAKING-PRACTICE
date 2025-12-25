"use client";
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useState, useEffect } from "react";

// Type definitions
interface MentorSkill {
  mentorId: string;
  mentorName: string;
  rating: number;
  learnerCount: number;
  specialization: string;
}

interface Skill {
  skillId: string;
  skillName: string;
  description: string;
  status: 'Active' | 'Inactive';
  createdDate: string;
  updatedDate: string;
  assignedMentors: MentorSkill[];
}

const sampleSkills: Skill[] = [
  {
    skillId: "SKL001",
    skillName: "Pronunciation",
    description: "Teaching correct pronunciation and accent reduction techniques",
    status: "Active",
    createdDate: "2024-01-15",
    updatedDate: "2025-09-20",
    assignedMentors: [
      { mentorId: "M005", mentorName: "Ms. Lisa Anderson", rating: 4.8, learnerCount: 45, specialization: "Phonetics" },
      { mentorId: "M012", mentorName: "Prof. Mark Brown", rating: 4.7, learnerCount: 38, specialization: "Accent Training" }
    ]
  },
  {
    skillId: "SKL002",
    skillName: "IELTS Speaking",
    description: "Specialized training for IELTS speaking test preparation",
    status: "Active",
    createdDate: "2024-02-10",
    updatedDate: "2025-09-18",
    assignedMentors: [
      { mentorId: "M001", mentorName: "Dr. Sarah Johnson", rating: 4.9, learnerCount: 62, specialization: "IELTS Expert" },
      { mentorId: "M006", mentorName: "Dr. David Kim", rating: 4.8, learnerCount: 54, specialization: "Test Strategy" }
    ]
  },
  {
    skillId: "SKL003",
    skillName: "Business English",
    description: "Professional English communication for workplace scenarios",
    status: "Active",
    createdDate: "2024-03-05",
    updatedDate: "2025-09-15",
    assignedMentors: [
      { mentorId: "M004", mentorName: "Dr. James Rodriguez", rating: 4.6, learnerCount: 41, specialization: "Corporate Communication" },
      { mentorId: "M011", mentorName: "Ms. Jennifer Lee", rating: 4.7, learnerCount: 35, specialization: "Business Presentations" }
    ]
  },
  {
    skillId: "SKL004",
    skillName: "TOEFL Preparation",
    description: "Comprehensive TOEFL test preparation and strategies",
    status: "Active",
    createdDate: "2024-04-12",
    updatedDate: "2025-09-12",
    assignedMentors: [
      { mentorId: "M002", mentorName: "Prof. Michael Chen", rating: 4.8, learnerCount: 47, specialization: "TOEFL Expert" }
    ]
  },
  {
    skillId: "SKL005",
    skillName: "Conversation Practice",
    description: "Daily conversation skills and fluency development",
    status: "Active",
    createdDate: "2024-05-20",
    updatedDate: "2025-09-10",
    assignedMentors: [
      { mentorId: "M007", mentorName: "Ms. Sophie Martinez", rating: 4.5, learnerCount: 52, specialization: "Conversation Flow" },
      { mentorId: "M009", mentorName: "Ms. Emma Wilson", rating: 4.6, learnerCount: 43, specialization: "Cultural Context" }
    ]
  },
  {
    skillId: "SKL006",
    skillName: "Medical English",
    description: "English for healthcare professionals and medical terminology",
    status: "Active",
    createdDate: "2024-06-15",
    updatedDate: "2025-09-08",
    assignedMentors: [
      { mentorId: "M010", mentorName: "Dr. William Foster", rating: 4.9, learnerCount: 28, specialization: "Medical Terminology" }
    ]
  },
  {
    skillId: "SKL007",
    skillName: "Public Speaking",
    description: "Confidence building and public speaking techniques",
    status: "Inactive",
    createdDate: "2024-07-08",
    updatedDate: "2025-08-30",
    assignedMentors: [
      { mentorId: "M011", mentorName: "Ms. Jennifer Lee", rating: 4.7, learnerCount: 31, specialization: "Presentation Skills" }
    ]
  },
  {
    skillId: "SKL008",
    skillName: "Academic Writing",
    description: "Research writing and academic paper composition",
    status: "Active",
    createdDate: "2024-08-22",
    updatedDate: "2025-09-05",
    assignedMentors: [
      { mentorId: "M008", mentorName: "Prof. Robert Taylor", rating: 4.6, learnerCount: 29, specialization: "Academic Research" }
    ]
  },
  {
    skillId: "SKL009",
    skillName: "Cambridge Exams",
    description: "FCE, CAE, CPE exam preparation and practice",
    status: "Active",
    createdDate: "2024-09-10",
    updatedDate: "2025-09-02",
    assignedMentors: [
      { mentorId: "M014", mentorName: "Dr. Alex Johnson", rating: 4.8, learnerCount: 22, specialization: "Cambridge Expert" }
    ]
  },
  {
    skillId: "SKL010",
    skillName: "IT English",
    description: "Technical English for IT professionals and developers",
    status: "Inactive",
    createdDate: "2024-10-05",
    updatedDate: "2025-08-25",
    assignedMentors: [
      { mentorId: "M013", mentorName: "Mr. Kevin Park", rating: 4.4, learnerCount: 18, specialization: "Technical Communication" }
    ]
  }
];

const SkillManagement = () => {
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [search, setSearch] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false);
  const [actionType, setActionType] = useState<'delete'>('delete');
  const [skillToAction, setSkillToAction] = useState<Skill | null>(null);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  // Filter skills
  const filteredSkills = sampleSkills.filter(skill => {
    const matchesSearch = skill.skillName.toLowerCase().includes(search.toLowerCase()) ||
                         skill.skillId.toLowerCase().includes(search.toLowerCase()) ||
                         skill.description.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || skill.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleSelectRow = (idx: number) => {
    setSelectedRows(selectedRows.includes(idx)
      ? selectedRows.filter(i => i !== idx)
      : [...selectedRows, idx]);
  };

  const handleSelectAll = () => {
    if (selectedRows.length === filteredSkills.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(filteredSkills.map((_, idx) => idx));
    }
  };

  const handleEditSkill = (skill: Skill) => {
    setSelectedSkill(skill);
    setShowEditModal(true);
  };

  const handleAction = (skill: Skill, action: 'delete') => {
    setSkillToAction(skill);
    setActionType(action);
    setShowConfirmDialog(true);
  };

  const confirmAction = () => {
    console.log(`${actionType}ing skill:`, skillToAction);
    setShowConfirmDialog(false);
    setSkillToAction(null);
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
            placeholder="Search skills..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-[300px]"
          />
          <select 
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 border rounded-md"
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
          Add Skill
        </Button>
      </div>
      
      <div className="overflow-x-auto rounded-xl border shadow">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#f7f9fa]">
              <TableHead>
                <Checkbox
                  checked={selectedRows.length === filteredSkills.length && filteredSkills.length > 0}
                  onCheckedChange={handleSelectAll}
                  aria-label="Select all"
                />
              </TableHead>
              <TableHead>Skill ID</TableHead>
              <TableHead>Skill Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Total Mentors</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSkills.map((skill, idx) => (
              <TableRow key={skill.skillId} className="hover:bg-[#f0f7e6]">
                <TableCell>
                  <Checkbox
                    checked={selectedRows.includes(idx)}
                    onCheckedChange={() => handleSelectRow(idx)}
                    aria-label={`Select row ${idx}`}
                  />
                </TableCell>
                <TableCell className="font-medium text-blue-600">{skill.skillId}</TableCell>
                <TableCell className="font-medium">
                  {skill.skillName}
                </TableCell>
                <TableCell className="text-gray-600 max-w-[250px] truncate" title={skill.description}>
                  {skill.description}
                </TableCell>
                <TableCell className="text-center">
                  <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    {skill.assignedMentors.length} mentors
                  </span>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={skill.status === "Active" ? "default" : "secondary"}
                    className={skill.status === "Active" ? "bg-green-600 text-white" : "bg-red-400 text-white"}
                  >
                    {skill.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <div className="relative dropdown-container">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setOpenDropdownId(openDropdownId === skill.skillId ? null : skill.skillId)}
                      className="p-1 h-8 w-8 cursor-pointer"
                    >
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="1"/>
                        <circle cx="19" cy="12" r="1"/>
                        <circle cx="5" cy="12" r="1"/>
                      </svg>
                    </Button>
                    
                    {openDropdownId === skill.skillId && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border z-10">
                        <div className="py-1">
                          <button
                            onClick={() => {
                              handleEditSkill(skill);
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
                              handleAction(skill, 'delete');
                              setOpenDropdownId(null);
                            }}
                            className="block cursor-pointer w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                            disabled={skill.assignedMentors.length > 0}
                            title={skill.assignedMentors.length > 0 ? "Cannot delete skill with assigned mentors" : "Delete skill"}
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
          ACTIVE SKILLS: {filteredSkills.filter(s => s.status === "Active").length}/{filteredSkills.length} | 
          TOTAL MENTORS: {filteredSkills.reduce((sum, s) => sum + s.assignedMentors.length, 0)}
        </div>
        <div>Số dòng trên mỗi trang: <span className="font-semibold">10</span> &nbsp; 1-10 trong số {filteredSkills.length}</div>
      </div>

      {/* Add Skill Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl max-h-[90vh] overflow-y-auto w-full mx-4">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">Add New Skill</h2>
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
                  <label className="block text-sm font-medium mb-2">Skill Name *</label>
                  <Input 
                    placeholder="e.g., Advanced Grammar" 
                    className="w-full"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Description *</label>
                  <textarea 
                    placeholder="Describe the skill and what it covers..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
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
                    Create Skill
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Skill Modal */}
      {showEditModal && selectedSkill && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl max-h-[90vh] overflow-y-auto w-full mx-4">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">Edit Skill</h2>
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
                  <label className="block text-sm font-medium mb-2">Skill ID</label>
                  <Input 
                    value={selectedSkill.skillId}
                    className="w-full bg-gray-100"
                    disabled
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Skill Name *</label>
                  <Input 
                    defaultValue={selectedSkill.skillName}
                    className="w-full"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Description *</label>
                  <textarea 
                    defaultValue={selectedSkill.description}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Status *</label>
                  <select 
                    defaultValue={selectedSkill.status}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    required
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
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
                    Update Skill
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Dialog */}
      {showConfirmDialog && skillToAction && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
            <h3 className="text-lg font-semibold mb-4">
              Confirm Delete Skill
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete <strong>{skillToAction.skillName}</strong>? 
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
                Delete Skill
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillManagement;
