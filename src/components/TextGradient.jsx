export default function TextGradient(props) {
    const from = props.from || 'from-orange-700'
    const via = props.via || 'via-blue-500'
    const to = props.to || 'to-green-400'
    const className = props.className || ''
  
    return (
      <span
        className={`bg-gradient-to-r ${from} ${via} ${to} ${className} text-transparent bg-clip-text bg-300% animate-gradient font-bold`}
      >
        {props.text}
      </span>
    )
  }