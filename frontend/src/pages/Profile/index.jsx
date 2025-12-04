import useUserStore from "../../store/useUserStore";

const Profile = () => {
    const { user, isLoggedIn, login, logout, updateUser } = useUserStore();
    return (
        <div>
            {isLoggedIn ? (
                <>
                <h2>Welcome, {user.name}</h2>
                <p>Email: {user.email}</p>
                <button onClick={() => updateUser({ name: '새 이름' })}>
                    이름 변경
                </button>
                <button onClick={logout}>로그아웃</button>
                </>
            ) : (
                <>
                <h2>로그인이 필요합니다</h2>
                <button onClick={() => login({ id: 1, name: '홍길동', email: 'hong@test.com' })}>
                    로그인
                </button>
                </>
            )}
        </div>
    );
};

export default Profile;