import * as React from 'react';
import { useState, useEffect } from 'react';
import { Card } from '@material-tailwind/react';
import { Calendar, Plus, Settings, Clock, AlertTriangle, Activity, CheckCircle } from 'lucide-react';
import { Search, ChevronRight, ChevronLeft, Server } from 'lucide-react';
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import isEqual from "lodash.isequal";
import API_INSTANCE from '../services/auth.js';
import { toast } from 'react-toastify';


const MaintenanceDetails = () => {
    const navigate = useNavigate();
    const { maintenanceId } = useParams();
    const [maintenanceData, setMaintenanceData] = useState(null);
    const [originalTasks, setOriginalTasks] = useState([]);
    const [tasks, setTasks] = useState([]);

    const [newNote, setNewNote] = useState(''); // To store the new note being added
    const [completedTasks, setCompletedTasks] = useState(0);
    const [totalTasks, setTotalTasks] = useState(0);
    const [isModified, setIsModified] = useState(false);
    const [loading, setLoading] = useState(true);

    const handleGoBack = () => {
        navigate("/maintenance");
    };

    useEffect(() => {
        const fetchMaintenanceData = async () => {
            try {
                const response = await API_INSTANCE.get(`/maintenance/maintenanceId/${maintenanceId}`);
                const data = response.data.data;
                setMaintenanceData(data);
                setTasks(data.tasks || []);
                setOriginalTasks(data.tasks || []);
                setCompletedTasks(data.tasks.filter((task) => task.status === "completed").length);
            } catch (error) {
                console.error("Error fetching maintenance data:", error);
                toast.error("Failed to load maintenance data.");
            } finally {
                setLoading(false);
            }
        };

        if (maintenanceId) {
            fetchMaintenanceData();
        }
    }, [maintenanceId]);

    const handleNewNoteChange = (e) => {
        setNewNote(e.target.value);
        setIsModified(e.target.value.trim().length > 0);
    };

    const handleSaveNote = async () => {
        if (!newNote.trim()) return;

        try {
            await API_INSTANCE.post(`/maintenance/update/note/${maintenanceData._id}`, { newNote });
            toast.success("Notes saved successfully.");
            setNewNote('');
            setIsModified(false);
        } catch (error) {
            console.error('Error saving note:', error);
            toast.info("Failed to save notes");
        }
    };

    const handleCheckboxChange = (index) => {
        const updatedTasks = [...tasks];
        const task = updatedTasks[index];

        task.status = task.status === "completed" ? "pending" : "completed";
        task.time = task.status === "completed" ? new Date().toISOString() : null;

        setTasks(updatedTasks);
        setIsModified(isTasksModified(updatedTasks, originalTasks));
        setCompletedTasks(updatedTasks.filter((t) => t.status === "completed").length);
    };

    const isTasksModified = (currentTasks, originalTasks) => {
        return JSON.stringify(currentTasks) !== JSON.stringify(originalTasks);
    };

    const handleSaveTask = async () => {
        try {
            await API_INSTANCE.put(`/maintenance/update/task/${maintenanceData._id}`, { tasks });
            setOriginalTasks([...tasks]);
            setIsModified(false);
            toast.success("Tasks saved successfully.");
        } catch (error) {
            console.error("Error saving tasks:", error);
            toast.error("Failed to save tasks.");
        }
    };

    const formatDate = (isoDate) => {
        if (!isoDate) return "No date available";

        const date = new Date(isoDate);

        if (isNaN(date)) return "Invalid date";

        return date.toLocaleString('en-US', {
            // weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        });
    };

    if (loading) return <p>Loading...</p>;
    if (!maintenanceData) return <p>No maintenance data found.</p>;

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="p-6 space-y-6">
                {/* Header Section */}
                <div className="flex justify-between items-center">
                    <div>
                        <div className="flex items-center gap-2">
                            <button className="text-blue-500 hover:text-blue-600" onClick={handleGoBack}>← Back</button>
                            <div>
                                <h1 className="text-2xl font-bold">Server Maintenance - Rack A1</h1>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                        Scheduled
                                    </span>
                                    <span className="text-gray-500">•</span>
                                    <span className="text-gray-500 text-sm">Scheduled for Nov 15, 2024</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <button className="px-4 py-2 text-blue-500 border border-blue-500 rounded-lg hover:bg-blue-50">
                            Reschedule
                        </button>
                        <button className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg">
                            Mark as Complete
                        </button>
                    </div>
                </div>

                {/* Status Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {maintenanceData && [
                        { title: 'Status', icon: Activity, value: maintenanceData.status, subtext: '2 days until maintenance', bgColor: 'bg-blue-100', textColor: 'text-blue-600' },
                        { title: 'Duration', icon: Clock, value: '2 hours', subtext: '10:00 AM - 12:00 PM', bgColor: 'bg-purple-100', textColor: 'text-purple-600' },
                        { title: 'Priority', icon: AlertTriangle, value: maintenanceData.priority, subtext: 'Critical system', bgColor: 'bg-orange-100', textColor: 'text-orange-600' },
                        { title: 'Type', icon: Settings, value: maintenanceData.type, subtext: 'Regular maintenance', bgColor: 'bg-green-100', textColor: 'text-green-600' }
                    ].map((item, i) => (
                        <Card key={i} className="p-4 hover:shadow-lg transition-all duration-200">
                            <div className="flex justify-between items-start">
                                <div className={`p-2 ${item.bgColor} rounded-lg`}>
                                    <item.icon className={`w-5 h-5 ${item.textColor}`} />
                                </div>
                                <span className="text-sm text-gray-500">#{i + 1001}</span>
                            </div>
                            <p className="text-sm text-gray-500 mt-4">{item.title}</p>
                            <p className="text-lg font-semibold">{item.value}</p>
                            <p className="text-xs text-gray-500 mt-1">{item.subtext}</p>
                        </Card>
                    ))}
                </div>

                {/* Main Content Area */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Checklist and Details */}
                    <Card className="p-4 lg:col-span-2">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold">Maintenance Checklist</h2>
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-500">{completedTasks}/{totalTasks} completed</span>
                                <div className="w-24 h-2 bg-gray-200 rounded-full">
                                    <div
                                        className="h-full bg-green-500 rounded-full"
                                        style={{ width: `${(completedTasks / totalTasks) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-3">
                            {tasks && tasks.map((item, i) => (
                                <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                    <input
                                        type="checkbox"
                                        checked={item.status === "completed"}
                                        onChange={() => handleCheckboxChange(i)}
                                        className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                    />
                                    <div className="flex-1">
                                        <div className="flex justify-between">
                                            <span className={item.status === "completed" ? "line-through text-gray-500" : "font-medium"}>
                                                {item.task}
                                            </span>
                                            <span className="text-sm text-gray-500">
                                                {item.status === "completed" && item.time ? formatDate(item.time) : ""}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={handleSaveTask}
                            disabled={!isModified}
                            className={`mt-4 text-sm font-medium flex items-center gap-1 
                                ${isModified ? "text-blue-500 hover:text-blue-600"
                                    : "text-gray-400 cursor-not-allowed"
                                }`}
                        >
                            <Plus className="w-4 h-4" /> Save
                        </button>
                    </Card>

                    {/* Equipment Details */}
                    <div className="space-y-6">
                        <Card className="p-4">
                            <h2 className="text-lg font-semibold mb-4">Equipment Details</h2>
                            <div className="space-y-4">
                                {maintenanceData &&
                                    [{ label: 'Equipment ID', value: maintenanceData.equip_id._id },
                                    { label: 'Manufacturer', value: maintenanceData.equip_id.manufacturer },
                                    { label: 'Model', value: maintenanceData.equip_id.model },
                                    { label: 'Serial Number', value: maintenanceData.equip_id.serialNumber },
                                    { label: 'Location', value: maintenanceData.equip_id.locationId.name },
                                    { label: 'Last Maintenance', value: formatDate(maintenanceData.equip_id.lastMaintenanceDate) },
                                    { label: 'Status', value: maintenanceData.equip_id.status }
                                    ].map((detail, i) => (
                                        <div key={i} className="flex justify-between py-2 border-b last:border-0">
                                            <span className="text-gray-500">{detail.label}</span>
                                            <span className="font-medium">{detail.value}</span>
                                        </div>
                                    ))}
                            </div>
                        </Card>
                    </div>
                </div>

                {/* Notes and Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="p-4">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold">Maintenance Notes</h2>
                            <button
                                className="text-blue-500 hover:text-blue-600 text-sm font-medium"
                                onClick={handleSaveNote}
                                disabled={!isModified}
                            >
                                Save Notes
                            </button>
                        </div>
                        <textarea
                            className="w-full h-32 p-3 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Add maintenance notes..."
                            value={newNote}
                            onChange={handleNewNoteChange}
                        ></textarea>
                        <div className="mt-4 space-y-3">
                            {maintenanceData && maintenanceData?.notes?.map((note, index) => (
                                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="font-medium">{note.username}</span>
                                        <span className="text-xs text-gray-500">
                                            {new Date(note.time).toLocaleString()}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600">{note.remark}</p>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <Card className="p-4">
                        <h2 className="text-lg font-semibold mb-4">Activity Log</h2>
                        <div className="space-y-4">
                            {maintenanceData && [
                                { action: 'Maintenance Scheduled', user: maintenanceData.user_id.username, time: '2 days ago', icon: Calendar },
                                { action: 'Updated Checklist', user: maintenanceData.tasksLastUpdatedBy.username, time: '1 day ago', icon: CheckCircle },
                                { action: 'Added Notes', user: maintenanceData.notesLastUpdatedBy.username, time: '5 hours ago', icon: Settings }
                            ].map((activity, i) => (
                                <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <activity.icon className="w-4 h-4 text-blue-600" />
                                    </div>
                                    <div>
                                        <div className="flex justify-between">
                                            <p className="font-medium">{activity.action}</p>
                                            <span className="text-sm text-gray-500">{activity.time}</span>
                                        </div>
                                        <p className="text-sm text-gray-500">by {activity.user}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};


export default MaintenanceDetails;