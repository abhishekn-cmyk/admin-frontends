import axios from "axios";

export const postUpload = async ({
  file,
  folder,
}: {
  file: File;
  folder: string;
}) => {
  const formData = new FormData();
  formData.append("file", file);
  console.log("Posting to: ", `/upload?folder=${folder}`);

  const response = await axios.post(
    `${import.meta.env.VITE_API_BASE_URL}/upload?folder=${folder}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return response.data;
};
