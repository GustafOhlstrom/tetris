import './GameModes.scss'
import { ReactComponent as MarathonSvg } from '../../assets/icons/marathon.svg'
import { ReactComponent as SprintSvg } from '../../assets/icons/sprint.svg'
import { ReactComponent as CloseSvg } from '../../assets/icons/close.svg'

const GameModes = ({ bestMarathon,  bestSprint, onStartGame, setPickMode }) => (
	<div className="gamemodes">
		<section className="gamemodes-content">
			<header className="gamemodes-header">
				<CloseSvg onClick={() => setPickMode(false)} />

				<h1>Select Game mode</h1>
			</header>

			<div className="gamemodes-container">
				<section className="gamemode">
					<header>
						<MarathonSvg />
						<h2>MARATHON</h2>
					</header>

					<div className="gamemode-desc">
						<h3>The classic tetris mode</h3>
						<p>Clear rows of blocks before they reach the top.</p>
					</div>

					{
						bestMarathon && <p className="pb">Best score: <span>{bestMarathon}</span></p>
					}
					<button onClick={() => onStartGame('marathon')}>Play</button>
				</section>

				<section className="gamemode">
					<header>
						<SprintSvg />
						<h2>SPRINT</h2>
					</header>

					<div className="gamemode-desc">
						<h3>Time limited mode</h3>
						<p>Get as many points as possible within 3 minutes</p>
					</div>

					{
						bestSprint && <p className="pb">Best score: <span>{bestSprint}</span></p>
					}
					<button onClick={() => onStartGame('sprint')}>Play</button>
				</section>
			</div>
		</section>
	</div>
)

export default GameModes

