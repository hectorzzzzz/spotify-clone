"use client"

import useCreatePlaylistModal from "@/hooks/useCreatePlaylistModal";
import Modal from "./Modal";
import { useForm, FieldValues, SubmitHandler } from "react-hook-form";
import { useState } from "react";
import Input from "./Input";
import Button from "./Button";
import { toast } from "react-hot-toast";
import { useUser } from "@/hooks/useUser";
import uniqid from "uniqid";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { FaFileUpload } from "react-icons/fa";
import Image from "next/image";

const PlaylistModal = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const playlistModal = useCreatePlaylistModal();
    const { user } = useUser();
    const supabaseClient = useSupabaseClient();
    const { register, handleSubmit, reset } = useForm<FieldValues>({
        defaultValues: {
            name: '',
            desc: '',
            image: null,
        }
    })
    const onChange = (open: boolean) => {
        if (!open) {
            reset();
            setSelectedImage(null);
            setPreviewUrl(null);
            playlistModal.onClose();
        }
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedImage(file);
            const imageUrl = URL.createObjectURL(file);
            setPreviewUrl(imageUrl);
        }
    };

    const onSubmit: SubmitHandler<FieldValues> = async (values) => {
        try {
            setIsLoading(true);
            const imageFile = selectedImage as File

            console.log("Form values:", values);
            console.log("Image file:", values.image?.[0]);
            console.log("User:", user);

            if (!imageFile || !user) {
                toast.error('Missing Fields');
                return;
            }

            const uniqueID = uniqid();

            //Upload image
            const {
                data: imageData,
                error: imageError,
            } = await supabaseClient
                .storage
                .from('images')
                .upload(`image-${values.name}-${uniqueID}`, imageFile, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (imageError) {
                setIsLoading(false);
                return toast.error('Failed image upload');
            }

            const {
                error: supabaseError
            } = await supabaseClient
                .from('playlists')
                .insert({
                    user_id: user.id,
                    name: values.name,
                    image_path: imageData.path,
                    desc: values.desc
                });

            if (supabaseError) {
                setIsLoading(false);
                return toast.error(supabaseError.message);
            }

            setIsLoading(false);
            toast.success('Playlist created!');
            reset();
            setPreviewUrl(null);
            playlistModal.onClose();

        } catch {
            toast.error("Something went wrong")
        } finally {
            setIsLoading(false);
        }
    }
    return (
        <Modal
            title="Create a New Playlist"
            description=""
            isOpen={playlistModal.isOpen}
            onChange={onChange}
            
        >
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex gap-4"
            >
                <label 
                    className="
                        relative
                        w-[200px]
                        h-[200px]
                        bg-neutral-800 
                        rounded-md 
                        overflow-hidden
                        flex
                        flex-col-reverse
                        items-center
                        justify-center
                        border
                        border-neutral-700
                        cursor-pointer
                    "
                    htmlFor="image"
                >
                    {previewUrl ? (
                        <Image
                            src={previewUrl}
                            alt="Preview"
                            className="object-cover w-full h-full absolute inset-0"
                        />
                    ) : (
                        <p className="text-sm text-neutral-400 text-center px-2">
                            Choose image
                        </p>
                        
                    )}
                    <FaFileUpload 
                        className="mt-2 text-neutral-400 mb-2"
                        size={25}
                    />
                </label>

                <div className="flex-1 flex flex-col gap-y-4">
                    <Input
                        id="name"
                        disabled={isLoading}
                        {...register('name', { required: true })}
                        placeholder="Playlist name"
                        className="text-white"
                    />
                    <textarea
                        id="desc"
                        disabled={isLoading}
                        {...register('desc', { maxLength: 250 })}
                        placeholder="Description"
                        className="
                            rounded-md
                            p-3
                            text-left
                            resize-y
                            w-full
                            min-h-[138px]
                            text-sm
                            placeholder:text-neutral-400
                            text-white
                        "
                    />
                    <div>
                        <Input
                            id="image"
                            type="file"
                            disabled={isLoading}
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                        />
                    </div>
                    <Button disabled={isLoading} type="submit">
                        Create Playlist
                    </Button>
                </div>
            </form>
        </Modal>

    )
}

export default PlaylistModal;