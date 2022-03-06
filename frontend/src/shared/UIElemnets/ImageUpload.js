import React, { useRef } from "react";

import Button from "./Button";
import './ImageUpload.css';

const ImageUpload = props => {
    const filePickerRef = useRef()
    const pickImageHandler = () => filePickerRef.current.click();

    const pickedHandler = event => {
        console.log(event.target)
    }

    return (
        <div className="form-control">
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
                    <img src="" alt='Preview' />
                </div>
                <Button type="button" onClick={pickImageHandler}>PICK IMAGE</Button>
            </div>

        </div>
    )
}

export default ImageUpload;