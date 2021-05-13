import { useLayoutEffect, useState } from "react"
import { boardWidth, boardHeight } from '../constants'

const useCellSize = () => {
	const [cellSize, setCellSize] = useState(0)

	useLayoutEffect(() => {
		function updateSize() {
			const { innerWidth, innerHeight } = window;

			let maxCellWidth
			if(innerWidth < 500) {
				maxCellWidth = (innerWidth - 8*4 ) / (boardWidth + 8)
			} else {
				maxCellWidth = (innerWidth - 80 ) / (boardWidth + 8)
			}

			const maxCellHeight = (innerHeight - 8*2 - 68 - 72) / boardHeight
			let newCellSize = maxCellWidth < maxCellHeight ? maxCellWidth : maxCellHeight
			if(newCellSize > 32) {
				newCellSize = 32
			}

			setCellSize(newCellSize);
		}

		window.addEventListener('resize', updateSize);
		updateSize();
		return () => window.removeEventListener('resize', updateSize);
	  }, []);

	return { cellSize }
}

export default useCellSize