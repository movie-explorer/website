import React, { useState } from 'react';
import '../styles/Group.css';

import GroupList from './GroupList.js';
import CreateGroup from './CreateGroup.js';
import GroupDetail from './GroupDetail.js';

export default function Group() {
    const [groups, setGroups] = useState([]); 
    const [selectedGroup, setSelectedGroup] = useState(null); 


    const handleCreateGroup = (groupName) => {
        if (groupName.trim() === '') {
            alert('Group name cannot be empty.');
            return;
        }
        const newGroup = { id: Date.now(), name: groupName, members: [], movies: [], showtimes: [] };
        setGroups([...groups, newGroup]);
        setSelectedGroup(newGroup);
    };

    
    const handleSelectGroup = (group) => {
        setSelectedGroup(group); 
    };

    
    const handleRemoveGroup = (groupId) => {
        const updatedGroups = groups.filter((group) => group.id !== groupId);
        setGroups(updatedGroups);
        setSelectedGroup(null); 
    };

    return (
        <div className="group-page">
            <h1>Welcome to the Movie Groups!</h1>

            <GroupList
                groups={groups}
                onSelectGroup={handleSelectGroup}
                onRemoveGroup={handleRemoveGroup}
            />

            <CreateGroup onCreateGroup={handleCreateGroup} />

            {selectedGroup && <GroupDetail group={selectedGroup} onRemoveGroup={handleRemoveGroup} />}
        </div>
    );
}
