import React, { useState } from 'react';
import '../styles/Group.css';

import GroupList from './GroupList.js';
import CreateGroup from './CreateGroup.js';
import GroupDetail from './GroupDetail.js';

export default function Group() {
    const [groups, setGroups] = useState([]); // Holds all groups in the app
    const [selectedGroup, setSelectedGroup] = useState(null); // Holds the currently selected group

    // Create a new group and add it to the groups state
    const handleCreateGroup = (groupName) => {
        if (groupName.trim() === '') {
            alert('Group name cannot be empty.');
            return;
        }
        const newGroup = { id: Date.now(), name: groupName, members: [], movies: [], showtimes: [] };
        setGroups([...groups, newGroup]);
        setSelectedGroup(newGroup);
    };

    // Select a group from the list
    const handleSelectGroup = (group) => {
        setSelectedGroup(group); // Update selected group state
    };

    // Remove a group based on its unique ID
    const handleRemoveGroup = (groupId) => {
        const updatedGroups = groups.filter((group) => group.id !== groupId);
        setGroups(updatedGroups); // Update the groups list state
        setSelectedGroup(null); // Deselect the group
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
