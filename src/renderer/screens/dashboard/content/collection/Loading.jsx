import WaitingImage from '../../../../static/image/ilustration/waiting.png';

export default function Loading() {
  return (
    <div className="loading">
      <img src={WaitingImage} className="main" alt="Waiting image" />
      <div className="title">Silahkan tunggu</div>
    </div>
  );
}
