import axiosInstance from "@/lib/axiosInstance";

export const getMentorApplication = async (
  page: number = 1,
  limit: number = 10,
) => {
  const res = await axiosInstance.get(
    `/mentor-application/?limit=${limit}&page=${page}`,
  );

  return res.data;
};

export const uploadTermsFile = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await axiosInstance.post("/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data; 
};

export const updateMentorApplicationTermsWithFile = async (
  id: string,
  filePath: string,
) => {
  const res = await axiosInstance.put(`/mentor-application/terms/${id}`, {
    terms: filePath, // send the uploaded file path
  });
  return res.data;
};
export const approveMentorApplication = async (id: string) => {
  const res = await axiosInstance.put(`/mentor-application/approve/${id}`);

  return res.data;
};

export const rejectMentorApplication = async (id: string, remarks: string) => {
  const res = await axiosInstance.put(`/mentor-application/reject/${id}`, {
    remarks: remarks,
  });

  return res.data;
};

export const deleteMentorApplication = async (id: string) => {
  const res = await axiosInstance.post(`/mentor-application/${id}`);

  return res.data;
};
