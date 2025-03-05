/* eslint-disable no-unused-vars */

import React, { useEffect, useState } from "react";
import { pdfjs } from "react-pdf";
import PdfComp from "../components/PdfComp";
import { Button, FileInput, Label, TextInput } from "flowbite-react";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();

export default function PdfService() {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState("");
  const [allImage, setAllImage] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);

  useEffect(() => {
    getPdf();
  }, []);

  const getPdf = async () => {
    // const result = await axios.get("http://localhost:3300/get-files");
    const result = await fetch("/api/pdf/get-file", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    console.log(result.data.data);
    setAllImage(result.data.data);
  };

  const submitImage = async (e) => {
    console.log("hii");
    e.preventDefault();
    console.log(title, file);
    const formData = new FormData();
    formData.append('title', title);
    formData.append('file', file);
   
    console.log("form Data",formData);
    try {
        console.log(formData.get('file'));
    console.log(formData.get('title'));
        const result = await fetch("/api/pdf/upload-file", {
          method: "POST",
          
          body: JSON.stringify(formData),
          headers:{
            "Custom-Header":"value",
          }
        
        });
      console.log(result);
        if (result.ok) {
          alert("Uploaded Successfully!!!");
          getPdf();
        } else {
          console.error("Upload failed:", result.statusText);
        }
      } catch (error) {
        console.error("Error uploading file:", error);
      }
  };

  const showPdf = (pdf) => {
    // window.open(http://localhost:3300/files/${pdf}, "_blank", "noreferrer");
    setPdfFile(`http://localhost:3000/files/${pdf}`);
  };

  return (
    <div className="">
        <div>
      <form className="formStyle w-[650px] mx-auto" onSubmit={submitImage}>
        <h4>Upload Schedule</h4>
        <br />
        <div>
          <Label value="Title" />
          <TextInput
            type="text"
            placeholder="Rudyard"
            id="password"
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="mb-2 block">
          <Label htmlFor="file-upload" value="Upload file" />
        </div>
        <FileInput
          id="file-upload"
          onChange={(e) => setFile(e.target.files[0])}
          name="pdfFile"
          required
        />
        <br />
        <Button gradientDuoTone="purpleToBlue" type="submit" outline className="w-full">Submit </Button>
       
      </form>
      </div>
      <div className="uploaded">
        <h4>Uploaded PDF:</h4>
        <div className="output-div">
          {allImage == null
            ? ""
            : allImage.map((data) => {
                return (
                  <div className="inner-div" key={data.id}>
                    <h6>Title: {data.title}</h6>
                    <button
                      className="btn btn-primary"
                      onClick={() => showPdf(data.pdf)}
                    >
                      Show Pdf
                    </button>
                  </div>
                );
              })}
        </div>
      </div>
      <PdfComp pdfFile={pdfFile} />
    </div>
  );
}
/* eslint-disable no-unused-vars */
