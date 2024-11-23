import React, { useState } from "react";
import { Dialog, DialogHeader, DialogBody, DialogFooter } from "@material-tailwind/react";

const EquipmentAdd = ({ isOpen, onClose, onSubmit }) => {

    const [formData, setFormData] = useState({
        name: "",
        serialNumber: "",
        type: "",
        locationId: "",
        manufacturer: "",
        model: "",
        specifications: {
            powerRating: "",
            coolingCapacity: "",
            voltage: "",
            current: "",
        },
        metrics: {
            temperature: "",
            cpuLoad: "",
            memoryUsage: "",
            powerUsage: "",
            networkIn: "",
            networkOut: "",
            fanSpeed: "",
            lastUpdated: "",
        },
    });

    const isFormComplete = () => {
        const { name, serialNumber, type, locationId, manufacturer, model, specifications, metrics } = formData;
        return (
            name &&
            serialNumber &&
            type &&
            locationId &&
            manufacturer &&
            model &&
            Object.values(specifications).every((value) => value) &&
            Object.values(metrics).every((value) => value)
        );
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.includes(".")) {
            const [section, field] = name.split(".");
            setFormData((prev) => ({
                ...prev,
                [section]: {
                    ...prev[section],
                    [field]: value,
                },
            }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = () => {
        onSubmit(formData);
        onClose();
    };

    return (
        <Dialog
            open={isOpen}
            handler={onClose}
            className="fixed inset-0 z-50 flex justify-center items-center border-2 border-gray-300 rounded-lg"
        >
            <div className="w-[90%] max-w-2xl bg-white rounded-lg shadow-lg p-6 relative z-50">
                <DialogHeader className="flex justify-center items-center text-lg font-bold">
                    Add New Equipment
                </DialogHeader>
                <DialogBody className="space-y-4">
                    {/* General Inputs */}
                    <div>
                        <h3 className="font-semibold text-gray-700 mb-1">General Information</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            <input
                                type="text"
                                name="name"
                                placeholder="Equipment Name"
                                value={formData.name}
                                onChange={handleChange}
                                className="border px-4 py-2 rounded-lg w-full sm:w-[150px] md:w-[200px]"
                            />
                            <input
                                type="text"
                                name="serialNumber"
                                placeholder="Serial Number"
                                value={formData.serialNumber}
                                onChange={handleChange}
                                className="border px-4 py-2 rounded-lg w-full sm:w-[150px] md:w-[200px]"
                            />
                            <input
                                type="text"
                                name="type"
                                placeholder="Type"
                                value={formData.type}
                                onChange={handleChange}
                                className="border px-4 py-2 rounded-lg w-full sm:w-[150px] md:w-[200px]"
                            />
                            <input
                                type="text"
                                name="locationId"
                                placeholder="Location ID"
                                value={formData.locationId}
                                onChange={handleChange}
                                className="border px-4 py-2 rounded-lg w-full sm:w-[150px] md:w-[200px]"
                            />
                            <input
                                type="text"
                                name="manufacturer"
                                placeholder="Manufacturer"
                                value={formData.manufacturer}
                                onChange={handleChange}
                                className="border px-4 py-2 rounded-lg w-full sm:w-[150px] md:w-[200px]"
                            />
                            <input
                                type="text"
                                name="model"
                                placeholder="Model"
                                value={formData.model}
                                onChange={handleChange}
                                className="border px-4 py-2 rounded-lg w-full sm:w-[150px] md:w-[200px]"
                            />
                        </div>
                    </div>

                    {/* Specifications */}
                    <div>
                        <h3 className="font-semibold text-gray-700 mb-1">Specifications</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            <input
                                type="number"
                                name="specifications.powerRating"
                                placeholder="Power Rating"
                                value={formData.specifications.powerRating}
                                onChange={handleChange}
                                className="border px-4 py-2 rounded-lg w-full sm:w-[150px] md:w-[200px]"
                            />
                            <input
                                type="number"
                                name="specifications.coolingCapacity"
                                placeholder="Cooling Capacity"
                                value={formData.specifications.coolingCapacity}
                                onChange={handleChange}
                                className="border px-4 py-2 rounded-lg w-full sm:w-[150px] md:w-[200px]"
                            />
                            <input
                                type="number"
                                name="specifications.voltage"
                                placeholder="Voltage"
                                value={formData.specifications.voltage}
                                onChange={handleChange}
                                className="border px-4 py-2 rounded-lg w-full sm:w-[150px] md:w-[200px]"
                            />
                            <input
                                type="number"
                                name="specifications.current"
                                placeholder="Current"
                                value={formData.specifications.current}
                                onChange={handleChange}
                                className="border px-4 py-2 rounded-lg w-full sm:w-[150px] md:w-[200px]"
                            />
                        </div>
                    </div>

                    {/* Metrics */}
                    <div>
                        <h3 className="font-semibold text-gray-700 mb-1">Metrics</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            <input
                                type="number"
                                name="metrics.temperature"
                                placeholder="Temperature"
                                value={formData.metrics.temperature}
                                onChange={handleChange}
                                className="border px-4 py-2 rounded-lg w-full sm:w-[150px] md:w-[200px]"
                            />
                            <input
                                type="number"
                                name="metrics.cpuLoad"
                                placeholder="CPU Load"
                                value={formData.metrics.cpuLoad}
                                onChange={handleChange}
                                className="border px-4 py-2 rounded-lg w-full sm:w-[150px] md:w-[200px]"
                            />
                            <input
                                type="number"
                                name="metrics.memoryUsage"
                                placeholder="Memory Usage"
                                value={formData.metrics.memoryUsage}
                                onChange={handleChange}
                                className="border px-4 py-2 rounded-lg w-full sm:w-[150px] md:w-[200px]"
                            />
                            <input
                                type="number"
                                name="metrics.powerUsage"
                                placeholder="Power Usage"
                                value={formData.metrics.powerUsage}
                                onChange={handleChange}
                                className="border px-4 py-2 rounded-lg w-full sm:w-[150px] md:w-[200px]"
                            />
                            <input
                                type="number"
                                name="metrics.fanSpeed"
                                placeholder="Fan Speed"
                                value={formData.metrics.fanSpeed}
                                onChange={handleChange}
                                className="border px-4 py-2 rounded-lg w-full sm:w-[150px] md:w-[200px]"
                            />
                        </div>
                    </div>
                </DialogBody>
                <DialogFooter className="flex justify-between">
                    <button
                        onClick={handleSubmit}
                        className={`px-4 py-2 rounded-lg bg-blue-500 text-white ${!isFormComplete() ? "opacity-50 cursor-not-allowed" : ""}`}
                        disabled={!isFormComplete()}
                    >
                        Submit
                    </button>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg bg-gray-200"
                    >
                        Cancel
                    </button>
                </DialogFooter>
            </div>
        </Dialog>
    );
};

export default EquipmentAdd;
