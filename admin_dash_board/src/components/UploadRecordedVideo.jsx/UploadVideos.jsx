import React, { useState } from 'react'
import axios from "axios"
import { ToastContainer, toast } from 'react-toastify';



const UploadVideos = () => {
    const preset_key = "arsmfwi7"
    const cloud_name = "dnqlt6cit"
    const [inputs, setInputes] = useState({
        video: null,
        title: "",
        description: "",
        image: null
    })
    let [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        console.log(e.target.files);

        const { name, files, value } = e.target
        if (files && files.length > 0) {
            setInputes({ ...inputs, [name]: files[0] })
        } else {
            setInputes({ ...inputs, [name]: value })
        }
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            let img_url = null;
            let video_url = null;
            if (inputs.video) {
                const formData = new FormData()
                formData.append("file", inputs.video)
                formData.append("upload_preset", preset_key)

                let videoRes = await axios.post(`https://api.cloudinary.com/v1_1/${cloud_name}/video/upload`, formData)
                console.log(videoRes);
                video_url = videoRes.data.secure_url

            }

            if (inputs.image) {
                const formData = new FormData()
                formData.append("file", inputs.image)
                formData.append("upload_preset", preset_key)

                let imageRes = await axios.post(`https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`, formData)

                console.log(imageRes);
                img_url = imageRes.data.secure_url



            }
            let payloads = {
                video: video_url,
                title: inputs.title,
                description: inputs.description,
                image: img_url

            }

            let res = await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/upload_recorded_video`, payloads)

            console.log(res);

            if (res.data) {
                toast.success(res.data.message)
            }




        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false)
        }
    }
    console.log(inputs);

    return (
        <div className="max-w-4xl mx-auto mt-10 p-6 bg-white  shadow ">
            <ToastContainer />
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">Upload Product</h2>
            <form onSubmit={handleSubmit} className="space-y-4">

                {/* video */}
                <div>
                    <label className="block text-gray-700 dark:text-gray-200 font-medium mb-1">
                        Select video
                    </label>
                    <input
                        type="file"
                        name="video"
                        onChange={handleChange}
                        placeholder="Upload your video"
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-violet-500"
                        required
                    />
                </div>

                {/* title */}
                <div>
                    <label className="block text-gray-700 dark:text-gray-200 font-medium mb-1">
                        Title
                    </label>
                    <input
                        type="text"
                        name="title"
                        onChange={handleChange}
                        placeholder="Description"
                        className="w-full p-7 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-violet-500"
                        required
                    />
                </div>

                {/* description */}
                <div>
                    <label className="block text-gray-700 dark:text-gray-200 font-medium mb-1">
                        Description
                    </label>
                    <input
                        type="text"
                        name="description"
                        onChange={handleChange}
                        placeholder="Description"
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-violet-500"
                        required
                    />
                </div>

                {/* Thumbnail */}
                <div>
                    <label className="block text-gray-700 dark:text-gray-200 font-medium mb-1">
                        Thumbnail
                    </label>
                    <input
                        type="file"
                        name="image"
                        onChange={handleChange}
                        placeholder="Description"
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-violet-500"
                        required
                    />
                </div>



                {/* Submit Button */}
                <div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center bg-violet-500 hover:bg-violet-600 text-white font-semibold py-2 px-4 rounded transition-colors duration-200 disabled:opacity-50"
                    >
                        {loading && (
                            <div className="w-5 h-5 mr-2 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                        )}
                        {loading ? "Uploading..." : "Upload"}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default UploadVideos