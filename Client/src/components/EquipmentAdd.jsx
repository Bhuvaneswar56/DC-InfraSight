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
            temperature: "",
            voltage: "",
            current: "",
            maxLoad: "",
        },
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const isFormComplete = () => {
        const { name, serialNumber, type, locationId, manufacturer, model, createdBy, specifications } = formData;
        return (
            name &&
            serialNumber &&
            type &&
            locationId &&
            manufacturer &&
            model &&
            createdBy &&
            Object.values(specifications).every((value) => value)
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
        if (isFormComplete()) {
            onSubmit(formData);
            setSuccess("Equipment added successfully!");
            setError("");
            setFormData({
                name: "",
                serialNumber: "",
                type: "",
                locationId: "",
                manufacturer: "",
                model: "",
                specifications: {
                    powerRating: "",
                    temperature: "",
                    voltage: "",
                    current: "",
                    maxLoad: "",
                },
            });
            onClose();
        } else {
            setError("Please fill in all the required fields.");
            setSuccess("");
        }
    };

    return (
        <Dialog
            open={isOpen}
            handler={onClose}
            className="fixed inset-0 z-50 flex justify-center items-center border-2 border-gray-300 rounded-lg"
        >
            <div className="w-[90%] max-w-2xl bg-gray-50 rounded-lg shadow-lg p-6 relative z-50">
                <DialogHeader className="flex justify-center items-center text-lg font-bold">
                    Add New Equipment
                </DialogHeader>

                {error && <p className="text-red-500 text-center mt-2">{error}</p>}
                {success && <p className="text-green-500 text-center mt-2">{success}</p>}

                <DialogBody className="space-y-4">
                    <div>
                        <h3 className="font-semibold text-gray-700 mb-1">General Information</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <input
                                type="text"
                                name="name"
                                placeholder="Equipment Name"
                                value={formData.name}
                                onChange={handleChange}
                                className="border px-4 py-2 rounded-lg w-full"
                            />
                            <input
                                type="text"
                                name="serialNumber"
                                placeholder="Serial Number"
                                value={formData.serialNumber}
                                onChange={handleChange}
                                className="border px-4 py-2 rounded-lg w-full"
                            />
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                className="border px-4 py-2 rounded-lg w-full"
                            >
                                <option value="" disabled>Type</option>
                                <option value="CRAH">CRAH</option>
                                <option value="UPS">UPS</option>
                                <option value="PDU">PDU</option>
                                <option value="SERVER">SERVER</option>
                            </select>
                            <input
                                type="text"
                                name="locationId"
                                placeholder="Location ID"
                                value={formData.locationId}
                                onChange={handleChange}
                                className="border px-4 py-2 rounded-lg w-full"
                            />
                            <input
                                type="text"
                                name="manufacturer"
                                placeholder="Manufacturer"
                                value={formData.manufacturer}
                                onChange={handleChange}
                                className="border px-4 py-2 rounded-lg w-full"
                            />
                            <input
                                type="text"
                                name="model"
                                placeholder="Model"
                                value={formData.model}
                                onChange={handleChange}
                                className="border px-4 py-2 rounded-lg w-full"
                            />
                        </div>
                    </div>

                    {/* Specifications */}
                    <div>
                        <h3 className="font-semibold text-gray-700 mb-1">Specifications</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <input
                                type="number"
                                name="specifications.powerRating"
                                placeholder="Power Rating"
                                value={formData.specifications.powerRating}
                                onChange={handleChange}
                                className="border px-4 py-2 rounded-lg w-full"
                            />
                            <input
                                type="number"
                                name="specifications.temperature"
                                placeholder="Temperature"
                                value={formData.specifications.temperature}
                                onChange={handleChange}
                                className="border px-4 py-2 rounded-lg w-full"
                            />
                            <input
                                type="number"
                                name="specifications.voltage"
                                placeholder="Voltage"
                                value={formData.specifications.voltage}
                                onChange={handleChange}
                                className="border px-4 py-2 rounded-lg w-full"
                            />
                            <input
                                type="number"
                                name="specifications.current"
                                placeholder="Current"
                                value={formData.specifications.current}
                                onChange={handleChange}
                                className="border px-4 py-2 rounded-lg w-full"
                            />
                            <input
                                type="number"
                                name="specifications.maxLoad"
                                placeholder="Max Load"
                                value={formData.specifications.maxLoad}
                                onChange={handleChange}
                                className="border px-4 py-2 rounded-lg w-full"
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
