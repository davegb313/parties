import React, { useState, useEffect, useRef } from "react";

import Button from "./Button";
import './ImageUpload.css';

const ImageUpload = props => {
    const [file, setFile] = useState();
    const [previewUrl, setPreviewUrl] = useState();
    const [isValid, setIsValid] = useState(false);
    const filePickerRef = useRef()

    const pickImageHandler = () => filePickerRef.current.click();

    useEffect(()=> {
        if (!file) {
            return;
        } 
        const fileReader = new FileReader();
        fileReader.onload = () => {
            setPreviewUrl(fileReader.result);
        };
        fileReader.readAsDataURL(file);
    }, [file]);

    const pickedHandler = event => {
        let pickedFile
        let fileValidity = isValid;
        if (event.target.files) {
            pickedFile = event.target.files[0];
            setFile(pickedFile);
            setIsValid(true);
            fileValidity = true;
        } else {
            setIsValid(false);
            fileValidity = false;
        }
        props.onInput(props.id, pickedFile, fileValidity);
    }

    return (
        <div className="form-control center">
            <input 
                id={props.id} 
                style={{ display: "none" }}
                ref={filePickerRef}
                type="file" 
                accept=".jpg,.png,.jpeg"
                onChange={pickedHandler}
            />
            <div className="image-upload">
                <div className="image-upload-preview">
                    {previewUrl && <img src={previewUrl} alt='Preview' />}
                    {!previewUrl && <p>Please pick an image.</p>}
                </div>
                <Button type="button" onClick={pickImageHandler}>PICK IMAGE</Button>
            </div>
            {!isValid && <p>{props.errorText}</p>}
        </div>
    )
}

export default ImageUpload;