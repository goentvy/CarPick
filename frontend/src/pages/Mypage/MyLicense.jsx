// src/pages/mypage/MyLicense.jsx
import { useState } from 'react';

function MyLicense() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    // 간이 입력 검증
    const validateInputs = () => {
        const newErrors = {};
        const name = document.getElementById('driverName').value.trim();
        const birthday = document.getElementById('driverBirthday').value;
        const license = document.getElementById('licenseNumber').value.replace(/-/g, '');
        const serial = document.getElementById('serialNumber').value.trim();

        // 성명: 2자 이상
        if (!name || name.length < 2) {
            newErrors.name = '성명은 2자 이상 입력하세요';
        }

        // 생년월일: 선택 + 오늘 이전 날짜
        if (!birthday) {
            newErrors.birthday = '생년월일을 선택하세요';
        } else {
            const today = new Date();
            const selected = new Date(birthday);
            if (selected >= today) {
                newErrors.birthday = '생년월일을 다시 확인해주세요';
            }
        }

        // 면허번호: 12자리 숫자, 형식 AA-BB-CCCCCC-DE 허용 [web:267][web:273]
        if (!license || !/^\d{12}$/.test(license)) {
            newErrors.license = '면허번호는 하이픈 제외 12자리 숫자여야 합니다 (예: 119012345600)';
        }

        // 일련번호: 숫자+영문 6자리 [web:268][web:271]
        if (!serial || !/^[A-Za-z0-9]{6}$/.test(serial)) {
            newErrors.serial = '일련번호는 숫자/영문 6자리입니다 (뒷면 작은 사진 아래)';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // 간이 검증만 수행 (백엔드 호출 없음)
    const verifyLicense = async () => {
        if (!validateInputs()) return;

        setLoading(true);
        setResult('');

        // 실제 진위확인은 하지 않고 형식만 통과시키는 모드
        setTimeout(() => {
            setResult(
                '✅ 형식상 유효한 운전면허 정보입니다.\n\n' +
                '※ 실제 진위확인은 차량 수령 시 실물 운전면허증으로 최종 확인합니다.\n' +
                '※ 입력하신 정보와 실물 면허증이 일치하지 않을 경우, 예약이 취소되거나 이용이 제한될 수 있습니다.'
            );
            setLoading(false);
        }, 500);
    };

    return (
        <div id="content">
            <div
                style={{
                    minHeight: '60vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '20px',
                }}
            >
                <div className="secAi">
                    <div className="ai_box">
                        <h2>면허 정보</h2>
                        <p>등록된 면허 정보가 없습니다.</p>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            style={{
                                marginTop: '20px',
                                padding: '12px 24px',
                                background: '#007bff',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                            }}
                        >
                            면허 추가하기
                        </button>
                    </div>
                </div>

                {isModalOpen && (
                    <div
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'rgba(0,0,0,0.5)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 1000,
                        }}
                    >
                        <div
                            style={{
                                background: 'white',
                                padding: '30px',
                                borderRadius: '12px',
                                maxWidth: '500px',
                                width: '90%',
                            }}
                        >
                            <h3>
                                🔍 운전면허 정보 입력{' '}
                                <small style={{ color: '#666' }}>(간이 형식 검증)</small>
                            </h3>

                            <p style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                                ※ 입력 내용은 형식만 확인하며, 실제 진위 여부는 차량 수령 시 실물
                                운전면허증으로 최종 확인합니다.
                            </p>

                            <div style={{ margin: '20px 0' }}>
                                <div style={{ marginBottom: '10px' }}>
                                    <input
                                        id="driverName"
                                        placeholder="성명 (2자 이상)"
                                        maxLength={10}
                                        style={{
                                            width: '100%',
                                            padding: '10px',
                                            borderRadius: '4px',
                                            border: errors.name ? '2px solid #dc3545' : '1px solid #ddd',
                                        }}
                                    />
                                    {errors.name && (
                                        <small style={{ color: '#dc3545', display: 'block' }}>
                                            {errors.name}
                                        </small>
                                    )}
                                </div>

                                <div style={{ marginBottom: '10px' }}>
                                    <input
                                        id="driverBirthday"
                                        type="date"
                                        max="2010-12-31"
                                        style={{
                                            width: '100%',
                                            padding: '10px',
                                            borderRadius: '4px',
                                            border: errors.birthday ? '2px solid #dc3545' : '1px solid #ddd',
                                        }}
                                    />
                                    {errors.birthday && (
                                        <small style={{ color: '#dc3545', display: 'block' }}>
                                            {errors.birthday}
                                        </small>
                                    )}
                                </div>

                                <div style={{ marginBottom: '10px' }}>
                                    <input
                                        id="licenseNumber"
                                        placeholder="면허번호 (예: 11-90-123456-00)"
                                        maxLength={14}
                                        style={{
                                            width: '100%',
                                            padding: '10px',
                                            borderRadius: '4px',
                                            border: errors.license ? '2px solid #dc3545' : '1px solid #ddd',
                                        }}
                                    />
                                    {errors.license && (
                                        <small style={{ color: '#dc3545', display: 'block' }}>
                                            {errors.license}
                                        </small>
                                    )}
                                </div>

                                <div>
                                    <input
                                        id="serialNumber"
                                        placeholder="일련번호 (6자리, 사진 아래)"
                                        maxLength={6}
                                        style={{
                                            width: '100%',
                                            padding: '10px',
                                            borderRadius: '4px',
                                            border: errors.serial ? '2px solid #dc3545' : '1px solid #ddd',
                                            letterSpacing: '2px',
                                            textAlign: 'center',
                                            fontWeight: 'bold',
                                            fontSize: '16px',
                                        }}
                                    />
                                    {errors.serial && (
                                        <small style={{ color: '#dc3545', display: 'block' }}>
                                            {errors.serial}
                                        </small>
                                    )}
                                    <small style={{ color: '#666', fontSize: '12px' }}>
                                        📍 면허증 뒷면 작은 사진 오른쪽 아래 숫자/영문 6자리
                                    </small>
                                </div>
                            </div>

                            {result && (
                                <div
                                    style={{
                                        padding: '15px',
                                        borderRadius: '8px',
                                        marginBottom: '15px',
                                        whiteSpace: 'pre-line',
                                        background: result.includes('✅') ? '#d4edda' : '#f8d7da',
                                        color: result.includes('✅') ? '#155724' : '#721c24',
                                        border: `1px solid ${
                                            result.includes('✅') ? '#c3e6cb' : '#f5c6cb'
                                        }`,
                                    }}
                                >
                                    {result}
                                </div>
                            )}

                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button
                                    onClick={verifyLicense}
                                    disabled={loading}
                                    style={{
                                        flex: 1,
                                        padding: '12px',
                                        background: loading ? '#6c757d' : '#007bff',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '8px',
                                        cursor: loading ? 'not-allowed' : 'pointer',
                                        fontWeight: 'bold',
                                    }}
                                >
                                    {loading ? '검증중...' : '🔍 형식 검증하기'}
                                </button>
                                <button
                                    onClick={() => {
                                        setIsModalOpen(false);
                                        setResult('');
                                        setErrors({});
                                        setLoading(false);
                                    }}
                                    style={{
                                        flex: 1,
                                        padding: '12px',
                                        background: '#6c757d',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                    }}
                                >
                                    ❌ 닫기
                                </button>
                            </div>

                            <small
                                style={{
                                    color: '#666',
                                    marginTop: '15px',
                                    display: 'block',
                                    textAlign: 'center',
                                    fontSize: '12px',
                                }}
                            >
                                ※ 본 화면의 검증은 형식 확인용이며, 실제 운전 가능 여부는 차량 수령
                                시 실물 운전면허증으로 최종 확인합니다.
                            </small>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default MyLicense;
