import NumberCheck from '/src/assets/number-check.svg';
import Number1Select from '/src/assets/number1-select.svg';
import Number2Select from '/src/assets/number2-select.svg';
import Number3Select from '/src/assets/number3-select.svg';
import Number2Default from '/src/assets/number2-default.svg';
import Number3Default from '/src/assets/number3-default.svg';

const StepProgress = ({ step }) => {
  const getIcon = (index) => {
    if (index < step) return NumberCheck;
    if (index === step) return [Number1Select, Number2Select, Number3Select][index - 1];
    return [Number1Select, Number2Default, Number3Default][index - 1];
  };

  const labels = ['약관동의', '정보입력', '가입완료'];

  // bar 색상 조건
  const bar1Color = step === 1 ? 'bg-gray-300' : 'bg-blue-500';
  const bar2Color = step === 3 ? 'bg-blue-500' : 'bg-gray-300';

  return (
    <div className="relative w-full max-w-full mx-auto px-4 my-8">
        {/* 첫 번째 bar */}
        <div className={`absolute top-3 sm:top-4 left-[17%] w-[33%] h-px ${bar1Color} z-0`} />
        {/* 두 번째 bar */}
        <div className={`absolute top-3 sm:top-4 left-[50%] w-[33%] h-px ${bar2Color} z-0`} />
        
        <div className="flex justify-between items-start z-10 relative">
            {[1, 2, 3].map((num, i) => (
            <div key={num} className="flex flex-col items-center w-1/3">
                <img
                src={getIcon(num)}
                alt={`step-${num}`}
                className="w-7 h-7 sm:w-8 sm:h-8"
                />
                <p className={`mt-1 text-xs sm:text-sm text-center font-semibold`}>
                  {labels[i]}
                </p>
            </div>
            ))}
        </div>
    </div>

  );
};

export default StepProgress;
