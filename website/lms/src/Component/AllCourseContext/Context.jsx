import React, { useState } from 'react'
import { useEffect } from 'react'
import axios from "axios";



export const AllCourseDetail = React.createContext()

export const Context = (props) => {
    const [user, setUser] = useState(null)
    const [courseDetail, seCourseDetail] = useState([])
    const [assignments, setAssignments] = useState([])
    // const [result, setResult] = useState([])
   
    // const [userAnswer, setUserAnswer ]= useState()
    console.log(document.cookie)
    useEffect(() => {
        // const token = document.cookie.includes("userToken=")
        // if (!token) {
        //     return
        // } else {
        //     console.log("aaa")
        // };
        const getMe = async () => {
            let res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/me`, {
                withCredentials: true
            })
            console.log("res", res);
            if (res.data.success) {
                setUser(res.data.user)
            }

        }
        getMe()
    }, [])

    const sentDataToCheckoutPage = (course) => {
        seCourseDetail(course)

    }


    const assignmentSubmitting = (a) => {
        setAssignments(a)
    }
    // const getQuizResults = (userAnswer) => {
    //     setUserAnswer(userAnswer)



    // }



    return (
        <AllCourseDetail.Provider value={{ user, sentDataToCheckoutPage, setUser, courseDetail, assignmentSubmitting, assignments}}>
            {props.children}
        </AllCourseDetail.Provider>
    )
}

export default Context