
import React, { useState } from 'react';
import { UploadCloud, FileText, CheckCircle, AlertTriangle } from 'lucide-react';
import { api } from '../../services/api';

const UploadPage = ({ navigate }: { navigate: (p: string) => void }) => {
    const [dragActive, setDragActive] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [completed, setCompleted] = useState(false);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file) return;
        setUploading(true);
        try {
            await api.sessions.upload(file, 't01'); // Mock track ID
            setUploading(false);
            setCompleted(true);
            setTimeout(() => navigate('/tracks/t01/telemetry'), 1500); // Redirect to telemetry
        } catch (e) {
            console.error(e);
            setUploading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto py-12 animate-in fade-in duration-500">
            <div className="text-center mb-10">
                <h1 className="text-3xl font-bold text-white font-['Orbitron'] mb-3">UPLOAD SESSION DATA</h1>
                <p className="text-zinc-400">Supported formats: CSV, JSON, MoTeC CSV. Max file size: 50MB.</p>
            </div>

            <div 
                className={`
                    border-2 border-dashed rounded-3xl p-12 text-center transition-all duration-300
                    ${dragActive ? 'border-[#00D9FF] bg-[#00D9FF]/5 scale-105' : 'border-[#333] bg-[#0A0A0A]'}
                    ${completed ? 'border-green-500' : ''}
                `}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                {!file && !completed && (
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-20 h-20 bg-[#111] rounded-full flex items-center justify-center text-zinc-500 mb-2">
                            <UploadCloud size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-white">Drag & Drop Telemetry File</h3>
                        <p className="text-zinc-500 text-sm mb-4">or click to browse from your computer</p>
                        <input type="file" id="file-upload" className="hidden" onChange={handleChange} accept=".csv,.json" />
                        <label htmlFor="file-upload" className="bg-white text-black font-bold px-8 py-3 rounded-xl cursor-pointer hover:bg-zinc-200 transition-colors">
                            BROWSE FILES
                        </label>
                    </div>
                )}

                {file && !completed && (
                    <div className="flex flex-col items-center gap-6">
                         <div className="w-16 h-16 bg-[#111] rounded-xl flex items-center justify-center text-white mb-2">
                            <FileText size={32} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white">{file.name}</h3>
                            <p className="text-zinc-500 text-sm">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                        <button 
                            onClick={handleUpload} 
                            disabled={uploading}
                            className="bg-[#00D9FF] text-black font-bold px-12 py-3 rounded-xl hover:bg-[#00b8d4] disabled:opacity-50 flex items-center gap-2"
                        >
                            {uploading ? 'PROCESSING...' : 'START UPLOAD'}
                        </button>
                    </div>
                )}

                {completed && (
                    <div className="flex flex-col items-center gap-4 animate-in zoom-in duration-300">
                        <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mb-2">
                            <CheckCircle size={40} />
                        </div>
                        <h3 className="text-xl font-bold text-white">Upload Complete!</h3>
                        <p className="text-zinc-500">Redirecting to analysis dashboard...</p>
                    </div>
                )}
            </div>

            <div className="mt-8 flex gap-4 bg-[#111] p-4 rounded-xl border border-zinc-800">
                <AlertTriangle className="text-yellow-500 flex-shrink-0" />
                <div className="text-sm text-zinc-400">
                    <strong className="text-white block mb-1">Privacy Notice</strong>
                    Uploaded telemetry data is processed securely and used only for generating your performance report. Raw data is discarded after processing unless you choose to save it to your profile.
                </div>
            </div>
        </div>
    );
};

export default UploadPage;
