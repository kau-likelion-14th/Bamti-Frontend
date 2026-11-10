import React, { useState, useRef, useEffect } from "react";
import profileImg from "../../assets/image/밤티프로필.webp";
import {get, put, uploadProfile } from "../../Api"
import config from "../../Config";
import profileEdit from "../../assets/image/밤티프로필.webp";
import profilemusic from "../../assets/image/밤티프로필.webp";


const Profile = () => {
    const fileInputRef = useRef(null);

    const [nickname, setNickname] = useState("Likelion");
    const [intro, setIntro] = useState("안녕하세요");
    const [song, setSong] = useState("에필로그 - 아이유");

    const [profileImageUrl,  setProfileImageUrl] = useState(null);
    const [selectedImageFile, setSelectedImageFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    useEffect(() => {
        fetchProfileData();
    }, []);

    const fetchProfileData = async () => {
        try { 
            const response = await get(config.PROFILE.GET)
            
            const result = response?.result;

            console.log("프로필 데이터: ", result);

            if(!result) return;

            setNickname(result.username ?? "");
            setIntro(result.intro ?? "");
            setProfileImageUrl(result.profileImageUrl ?? null);

            const songResponse = await get(config.YOUTUBE.ME);

            if(
                songResponse?.isSuccess === false ||
                !Array.isArray(songResponse?.result)
            ) {
                throw new Error("유효하지 않은 노래 데이터 형식");
            }

            const songs = [...songResponse.result].sort(
                (a,bio) => new Date(bio.createdAt) - new Date(a.createdAt)
            );

            const latest = songs[0];

            setSong(latest ? `${latest.title} - ${latest.artist}` : "");

            console.log("프로필 데이터:", response);
        }catch (error) {
            console.error("프로필 데이터를 가져오는 중 오류 발생:", error);
        }
    };
    
    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setPreviewUrl(URL.createObjectURL(file));
    };

    const handleClickEditIcon = () => {
        fileInputRef.current?.click();
    };

    const [saved, setSaved] = useState(false);
    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const displayImageSrc = previewUrl || profileImageUrl || profileImg;

    return (
    <div className="profile-container">
        <div className="profile-section">
            <div className="profile-image">
                <img 
                    src={displayImageSrc} 
                    alt="프로필 이미지" 
                    className="profile-img" 
                />
                <img
                    src={profileEdit}
                    alt="프로필 수정 아이콘"
                    className="profile-img-edit"
                    onClick={handleClickEditIcon}
                />
                <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                    accept="image/*"
                />
            </div>
            <div className="profile-name">
                    {nickname}
            </div>
            <button className="profile-edit" onClick={handleSave}>프로필 저장</button>
        </div>
        <div className="profile-info">
            <div className="profile-details">
                <div className="profile-title">
                    한 줄 소개
                </div>
                <div className="profile-content-box">
                    <div className="profile-content">
                        <input
                            className="profile-content-input"
                            value={intro}
                            onChange={(e) => setIntro(e.target.value)}
                        />
                    </div>
                </div>
            </div>
            <div className="profile-details">
                <div className="profile-title">
                    좋아하는 노래
                </div>
                <div className="profile-content-box">
                    <div className="profile-content">
                        <span className="profile-music-icon">🎵</span>
                        <input
                            className="profile-content-input"
                            value={song}
                            placeholder="노래 제목 - 아티스트"
                            onChange={(e) => setSong(e.target.value)}
                        />
                    </div>
                    <img
                        src={profilemusic}
                        alt="프로필 노래 수정 아이콘"
                        className="profile-search-icon"
                    />
                </div>
            </div>
        </div>
    </div>
  );
};

export default Profile;