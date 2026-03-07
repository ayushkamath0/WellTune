import { motion, AnimatePresence } from "motion/react";
import { X, Upload, Image, Music, Video, FileText, Plus, Clock, Tag } from "lucide-react";
import { useState } from "react";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UploadModal({ isOpen, onClose }: UploadModalProps) {
  const [uploadType, setUploadType] = useState<"routine" | "playlist">("routine");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const categories = ["Meditation", "Sleep", "Fitness", "Wellness", "Productivity", "Mental Health"];

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle upload logic here
    console.log({ uploadType, title, description, duration, category, tags, files: selectedFiles });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-card/95 backdrop-blur-xl rounded-3xl border border-border/50 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
            >
              {/* Header */}
              <div className="px-6 py-5 border-b border-border/50 bg-gradient-to-r from-[var(--primary)]/5 to-[var(--secondary)]/5">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-semibold mb-1">
                      {uploadType === "routine" ? "Upload Routine" : "Create Playlist"}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Share your wellness content with the community
                    </p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onClose}
                    className="w-10 h-10 rounded-xl bg-muted/50 hover:bg-accent transition-colors flex items-center justify-center"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>

              {/* Content */}
              <div className="overflow-y-auto max-h-[calc(90vh-180px)] p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Type Toggle */}
                  <div className="flex gap-3">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setUploadType("routine")}
                      className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
                        uploadType === "routine"
                          ? "bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white shadow-lg"
                          : "bg-muted/50 hover:bg-accent"
                      }`}
                    >
                      Single Routine
                    </motion.button>
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setUploadType("playlist")}
                      className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
                        uploadType === "playlist"
                          ? "bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white shadow-lg"
                          : "bg-muted/50 hover:bg-accent"
                      }`}
                    >
                      Playlist
                    </motion.button>
                  </div>

                  {/* Title */}
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium mb-2">
                      Title *
                    </label>
                    <input
                      id="title"
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder={uploadType === "routine" ? "Morning Meditation Flow" : "Evening Wind-Down Collection"}
                      required
                      className="w-full px-4 py-3 bg-background/50 backdrop-blur border border-border/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 transition-all"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium mb-2">
                      Description *
                    </label>
                    <textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe your routine or playlist..."
                      required
                      rows={3}
                      className="w-full px-4 py-3 bg-background/50 backdrop-blur border border-border/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 transition-all resize-none"
                    />
                  </div>

                  {/* Category and Duration */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="category" className="block text-sm font-medium mb-2">
                        Category *
                      </label>
                      <select
                        id="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                        className="w-full px-4 py-3 bg-background/50 backdrop-blur border border-border/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 transition-all"
                      >
                        <option value="">Select category</option>
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="duration" className="block text-sm font-medium mb-2">
                        Duration
                      </label>
                      <div className="relative">
                        <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <input
                          id="duration"
                          type="text"
                          value={duration}
                          onChange={(e) => setDuration(e.target.value)}
                          placeholder="15 min"
                          className="w-full pl-12 pr-4 py-3 bg-background/50 backdrop-blur border border-border/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Tags</label>
                    <div className="flex gap-2 mb-3">
                      <div className="relative flex-1">
                        <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <input
                          type="text"
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
                          placeholder="Add tag..."
                          className="w-full pl-12 pr-4 py-3 bg-background/50 backdrop-blur border border-border/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 transition-all"
                        />
                      </div>
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleAddTag}
                        className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] text-white flex items-center justify-center shadow-lg"
                      >
                        <Plus className="w-5 h-5" />
                      </motion.button>
                    </div>

                    {tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {tags.map((tag) => (
                          <motion.span
                            key={tag}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            whileHover={{ scale: 1.05 }}
                            className="px-3 py-1.5 bg-muted/50 rounded-lg text-sm flex items-center gap-2"
                          >
                            {tag}
                            <button
                              type="button"
                              onClick={() => handleRemoveTag(tag)}
                              className="hover:text-destructive transition-colors"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </motion.span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* File Upload */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {uploadType === "routine" ? "Media Files" : "Playlist Items"}
                    </label>
                    <div className="border-2 border-dashed border-border/50 rounded-xl p-8 text-center hover:border-[var(--primary)]/50 transition-colors">
                      <input
                        type="file"
                        multiple
                        onChange={handleFileSelect}
                        className="hidden"
                        id="file-upload"
                        accept="audio/*,video/*,image/*"
                      />
                      <label
                        htmlFor="file-upload"
                        className="cursor-pointer flex flex-col items-center gap-3"
                      >
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--primary)]/20 to-[var(--secondary)]/20 flex items-center justify-center"
                        >
                          <Upload className="w-8 h-8 text-[var(--primary)]" />
                        </motion.div>
                        <div>
                          <p className="font-medium mb-1">
                            Click to upload or drag and drop
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Audio, video, or images (max 100MB each)
                          </p>
                        </div>
                      </label>

                      {selectedFiles.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-border/50">
                          <p className="text-sm font-medium mb-2">
                            {selectedFiles.length} file(s) selected
                          </p>
                          <div className="flex flex-wrap gap-2 justify-center">
                            {selectedFiles.map((file, index) => (
                              <span
                                key={index}
                                className="px-3 py-1 bg-muted/50 rounded-lg text-xs flex items-center gap-2"
                              >
                                {file.type.startsWith("audio/") && <Music className="w-3 h-3" />}
                                {file.type.startsWith("video/") && <Video className="w-3 h-3" />}
                                {file.type.startsWith("image/") && <Image className="w-3 h-3" />}
                                {!file.type.startsWith("audio/") && !file.type.startsWith("video/") && !file.type.startsWith("image/") && <FileText className="w-3 h-3" />}
                                {file.name.length > 20 ? file.name.substring(0, 20) + "..." : file.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Info Box */}
                  <div className="bg-gradient-to-r from-[var(--primary)]/10 to-[var(--secondary)]/10 rounded-xl p-4 border border-[var(--primary)]/20">
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">💡 Pro tip:</span> High-quality content
                      with clear descriptions and relevant tags gets more engagement from the community.
                    </p>
                  </div>
                </form>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-border/50 bg-muted/20 flex gap-3">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  className="flex-1 py-3 px-4 rounded-xl bg-muted/50 hover:bg-accent transition-colors font-medium"
                >
                  Cancel
                </motion.button>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSubmit}
                  disabled={!title || !description || !category}
                  className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
                    title && description && category
                      ? "bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white shadow-lg hover:shadow-xl"
                      : "bg-muted text-muted-foreground cursor-not-allowed"
                  }`}
                >
                  Publish {uploadType === "routine" ? "Routine" : "Playlist"}
                </motion.button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
