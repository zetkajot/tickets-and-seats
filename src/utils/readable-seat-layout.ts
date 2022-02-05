import SeatLayout from '../domain/seat-layout';
import seatConversion from './rethrow/rehtrowing-templates/seat-conversion';
import Rethrower from './rethrow/rethrower';

export default class ReadableSeatLayoutFactory {
  public static fromSeatLayout(layout: SeatLayout): ReadableSeatLayout {
    return layout.layout.map((entry) => ({
      seatNo: entry.seatNo,
      seatPosition: {
        x: entry.position[0],
        y: entry.position[1],
      },
    }));
  }

  public static toSeatLayout(layout: ReadableSeatLayout): SeatLayout {
    const seatLayout = new SeatLayout();
    layout.forEach(({ seatNo, seatPosition }) => {
      const context = Rethrower.fromTemplate(seatConversion, seatLayout.addSeat.bind(seatLayout));
      context.execute(seatNo, [seatPosition.x, seatPosition.y]);
    });
    return seatLayout;
  }
}

export type ReadableSeatLayout = {
  seatNo: number;
  seatPosition: {
    x: number,
    y: number,
  }
}[];
