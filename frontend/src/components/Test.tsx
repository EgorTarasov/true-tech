import useSpeechRecognition from "../hooks/useSpeechRecognitionHook"


const Test = () => {
    const {
        text,
        isListening,
        startListening,
        stopListening,
        hasRecognitionSupport
    } = useSpeechRecognition();

    console.log(isListening)
    console.log(stopListening)
    return (
        <div>
            <div>
                {hasRecognitionSupport ? (
                    <button onClick={startListening}>Запустить</button>
                ) : (
                    <h1>Нет поддержки </h1>
                )}
            </div>
            <div> Тестилка</div>
            <p>
                {text}
            </p>
        </div>
    )
}

export default Test