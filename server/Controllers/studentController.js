const Batch = require("../modals/batches");
const Student = require("../modals/students");

const generateStudentId = async () => {
  const lastStudent = await Student.findOne({}).sort({ _id: -1 });
  if (!lastStudent || !lastStudent.studentId) return "STD001";

  const lastNum = parseInt(lastStudent.studentId.replace("STD", ""));
  const newNum = lastNum + 1;
  return "STD" + newNum.toString().padStart(3, "0");
};


exports.addStudent = async (req, res) => {
  try {
    const {isExist, name, email, phone, age, gender, accoutRegisterdEmail, profileImage, courseEnrolled, address, batch } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({ success: false, message: "Name, Email and Phone are required" });
    }

    const studentId = await generateStudentId();

    const student = await Student.create({
      isExist:true,
      studentId,
      name,
      email,
      phone,
      accoutRegisterdEmail,
      age,
      gender,
      profileImage,
      courseEnrolled,
      address,
      batch: batch || null,
    });

    if (batch) {
      const batchDoc = await Batch.findById(batch);
      if (batchDoc && !batchDoc.students.includes(student._id)) {
        batchDoc.students.push(student._id);
        await batchDoc.save();
      }
    }

    res.status(200).json({ success: true, message: "Student added successfully", data: student });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllStudent = async (req, res) => {
  try {
    let { page = 1, limit = 5, search = "" } = req.query;

    page = parseInt(page, 10) || 1;
    limit = parseInt(limit, 10) || 5;

    const query = {};

    if (search) {
      const regex = new RegExp(search, "i");
      query.$or = [
        { name: regex },
        { email: regex },
        { phone: regex },
        { courseEnrolled: regex },
        { studentId: regex },
      ];
    }

    const totalItems = await Student.countDocuments(query);
    const totalPages = Math.max(1, Math.ceil(totalItems / limit));

    if (page > totalPages) page = totalPages;

    const students = await Student.find(query)
      .populate("batch", "batchName") 
      .sort({ createdAt: -1 })        
      .skip((page - 1) * limit)
      .limit(limit);

    return res.status(200).json({
      success: true,
      data: students,
      page,
      totalPages,
      totalItems,
    });
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


exports.getStudent = async (req, res) => {
  const { id } = req.params
  try {
    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({ message: "student not found" });
    }
    if (student) {
      res.status(200).json({
        success: true,
        message: "student fatched successfully",
        student
      })
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

exports.updateStudent = async (req, res) => {
   try {
         const { id } = req.params
         const student = await Student.findByIdAndUpdate(
             id,
             { $set: req.body },
             { new: true, runValidators: true }
         )
 
         if (!student) {
             return res.status(404).json({
                 success: false,
                 message: "User not found"
             })
         }
 
         res.status(200).json({
             success: true,
             message: "User updated successfully",
             student,
             
         });
 
     } catch (error) {
         res.status(500).json({
             success: false,
             message: error.message
         });
     }
}

exports.deleteStudent = async (req, res) => {
  const { id } = req.params;
  try {
    const student = await Student.findByIdAndDelete(id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "student not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "student deleted succesfully!",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


exports.assignStudentToBatch = async (req, res) => {
  try {
    const { studentId, batchId } = req.body;

    if (!studentId || !batchId) {
      return res.status(400).json({ success: false, message: "Student ID and Batch ID required" });
    }

    const student = await Student.findById(studentId);
    const batch = await Batch.findById(batchId);

    if (!student || !batch) {
      return res.status(404).json({ success: false, message: "Student or Batch not found" });
    }

    student.batch = batchId;
    await student.save();

    if (!batch.students.includes(studentId)) {
      batch.students.push(studentId);
      await batch.save();
    }

    res.status(200).json({ success: true, message: "Student assigned to batch successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



exports.getStudentsByBatch = async (req, res) => {
  try {
    const { batchId } = req.params;
    const students = await Student.find({ batch: batchId }).populate("batch", "batchName");
    res.status(200).json({ success: true, data: students });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
