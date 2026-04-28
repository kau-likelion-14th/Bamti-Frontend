import React, { useState, useRef } from "react";
import profileImg from "../../assets/image/밤티프로필.webp";

const Profile = () => {
    const [previewUrl, setPreviewUrl] = useState(null);
    const [bio, setBio] = useState("");
    const [song, setSong] = useState("");
    const fileInputRef = useRef(null);

    const handleClickEditIcon = () => {
        fileInputRef.current?.click();
    };
    
    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setPreviewUrl(URL.createObjectURL(file));
    };

    const [saved, setSaved] = useState(false);
    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const displayImageSrc = previewUrl || profileImg;

    return (
        <div className="profile-container">
            <div className="profile-top">
                <div className="profile-img-wrapper">
                    <img src={displayImageSrc} alt="프로필" className="profile-img" />
                    <button className="profile-edit-icon" onClick={handleClickEditIcon}>✎</button>
                    <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        style={{display: "none"}}
                    />
                </div>
                <div className="profile-nickname">Bamti#0925</div>
                <button className="profile-save-btn" onClick={handleSave}>
                    {saved ? "저장 완료!" : "프로필 저장"}
                </button>
            </div>

            <div className="profile-field">
                <div className="profile-label">한 줄 소개</div>
                <input
                    className="profile-input"
                    placeholder="안녕하세요"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                />
            </div>
            <div className="profile-field">
                <div className="profile-label">좋아하는 노래</div>
                <input
                    className="profile-input"
                    placeholder="🎵 노래 제목 - 아티스트"
                    value={song}
                    onChange={(e) => setSong(e.target.value)}
                />
            </div>
        </div>
    );
};

export default Profile;