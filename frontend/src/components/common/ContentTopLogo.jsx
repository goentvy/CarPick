import Logo from '/public/images/common/logo.svg';

const ContentTopLogo = ({title, logoStyle="", titleStyle=""}) => {
    return (
        <div>
            <div className="flex justify-center my-3">
                <img src={Logo} alt="logo" className={logoStyle}/>
            </div>
            <p className={titleStyle}>{title}</p>
        </div>
    );
};

export default ContentTopLogo;