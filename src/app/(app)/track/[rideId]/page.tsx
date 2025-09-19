import TrackRideDetails from './track-ride-details';

export default function TrackRidePage({
  params,
}: {
  params: { rideId: string };
}) {
  return <TrackRideDetails rideId={params.rideId} />;
}
