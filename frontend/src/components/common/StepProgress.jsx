import NumberCheck from '/images/common/number-check.svg?url';
import Number1Select from '/images/common/number1-select.svg?url';
import Number2Select from '/images/common/number2-select.svg?url';
import Number3Select from '/images/common/number3-select.svg?url';
import Number2Default from '/images/common/number2-default.svg?url';
import Number3Default from '/images/common/number3-default.svg?url';

const StepProgress = ({ step }) => {
  const getIcon = (index) => {
    if (index < step) return NumberCheck;
    if (index === step) return [Number1Select, Number2Select, Number3Select][index - 1];
    return [Number1Select, Number2Default, Number3Default][index - 1];
  };

  const labels = ['약관동의', '정보입력', '가입완료'];

  // bar 색상 조건
  const bar1Color = step === 1 ? 'bg-gray-300' : 'bg-brand';
  const bar2Color = step === 3 ? 'bg-brand' : 'bg-gray-300';

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
