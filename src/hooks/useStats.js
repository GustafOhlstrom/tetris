import { useEffect, useState } from "react"

const useStats = clearedRows => {
	const [score, setScore] = useState(0)
	const [lines, setLines] = useState(0)
	const [level, setLevel] = useState(1)

	// Calculate score and lines when rows are deleted
	useEffect(() => {
		// Calculate score
		setLevel(prev => {
			setScore(prevScore => {
				switch(clearedRows.value) {
					case 1:
						return prevScore + (100 * prev)
					case 2:
						return prevScore + (300 * prev)
					case 3:
						return prevScore + (500 * prev)
					case 4:
						return prevScore + (800 * prev)
					default:
						return prevScore
				}
			})

			return prev
		})

		// Calculate lines
		setLines(prev => prev + clearedRows.value)
	}, [clearedRows])

	// Update level depending on lines change
	useEffect(() => {
		setLevel(prev => {
			if(prev * 10 <= lines) {
				return Math.floor(lines / 10) + 1
			} 

			return prev
		})
	}, [lines])

	return { score, lines, level }
}

export default useStats