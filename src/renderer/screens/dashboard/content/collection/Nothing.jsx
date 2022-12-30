import NothingImage from '../../../../static/image/ilustration/empty_state.png';

export default function Nothing() {
  return (
    <div className="nothing">
      <img src={NothingImage} alt="Empty state" draggable={false} />
    </div>
  );
}
