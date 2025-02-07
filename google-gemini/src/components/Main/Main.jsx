import React, { useContext } from 'react';
import './Main.css';
import { assets } from '../../assets/assets';
import ContextProvider, { Context } from '../../Context/Context';

const Main = () => {
    const {
        onSent, recentPrompt, showResult, loading, resultData,
        setInput, input, pauseTyping, resumeTyping, isPaused
    } = useContext(Context);

    return (
        <div className='main'>
            <div className="nav">
                <p>Gemini</p>
                <img src={assets.user_icon} alt="" />
            </div>
            <div className="main-container">

                {!showResult ? (
                    <>
                        <div className="greet">
                            <div className="greet-container">
                                <p><span>Hello, User</span><img src={assets.robot_icon} alt="Robot waving" className="robot-wave" /></p>
                            </div>
                            <p>How can I help you today?</p>
                        </div>

                        <div className="cards">
                            <div className="card" onClick={() => onSent("What is HTML Full Form?")}>
                                <p>What is HTML Full Form?</p>
                                <img src={assets.compass_icon} alt="" />
                            </div>
                            <div className="card" onClick={() => onSent("Briefly Explain about AWS")}>
                                <p>Briefly Explain about AWS</p>
                                <img src={assets.bulb_icon} alt="" />
                            </div>
                            <div className="card" onClick={() => onSent("Generate a short motivational quote for today.")}>
                                <p>Generate a short motivational quote for today.</p>
                                <img src={assets.message_icon} alt="" />
                            </div>
                            <div className="card" onClick={() => onSent("Briefly Summarize GenAI")}>
                                <p>Briefly Summarize GenAI</p>
                                <img src={assets.code_icon} alt="" />
                            </div>
                        </div>
                    </>
                ) : (
                    <div className='result'>
                        <div className="result-title">
                            <img src={assets.user_icon} alt="" />
                            <p>{recentPrompt}</p>
                        </div>
                        <div className="result-data">
                            <img src={assets.gemini_icon} alt="" />
                            {loading ? (
                                <div className='loader'>
                                    <hr />
                                    <hr />
                                    <hr />
                                </div>
                            ) : (
                                <p dangerouslySetInnerHTML={{ __html: resultData }}></p>
                            )}
                        </div>
                    </div>
                )}

                <div className="main-bottom">
                    <div className="search-box">
                        <input
                            onChange={(e) => setInput(e.target.value)}
                            value={input}
                            type="text"
                            placeholder="Enter a prompt here"
                            onKeyDown={(e) => e.key === "Enter" && input.trim() !== "" && onSent()}
                        />
                        <div className="search-box-icons">
                            <img src={assets.gallery_icon} alt="Gallery" />
                            <img src={assets.mic_icon} alt="Mic" />

                            {/* ✅ Show Pause Button While Typing & Send Button Otherwise */}
                            {showResult && loading ? (
                                isPaused ? (
                                    <img
                                        className="icon-btn"
                                        onClick={resumeTyping}
                                        src={assets.play_icon} // Resume icon
                                        alt="Resume"
                                    />
                                ) : (
                                    <img
                                        className="icon-btn"
                                        onClick={pauseTyping}
                                        src={assets.pause_icon} // Pause icon
                                        alt="Pause"
                                    />
                                )
                            ) : (
                                input && <img className="icon-btn" onClick={() => onSent()} src={assets.send_icon} alt="Send" />
                            )}
                        </div>
                    </div>
                    <p className="bottom-info">Gemini may display inaccurate info, including about people, so double-check its responses.</p>
                </div>
            </div>
        </div>
    );
};

export default Main;
