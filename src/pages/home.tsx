import {mount} from '../boot';
import {Marquee} from '../components/Marquee';
import {footer} from '../content';
import {Arrival} from '../home/Arrival';
import {Chapters} from '../home/Chapters';
import {Details} from '../home/Details';
import {Finale} from '../home/Finale';

mount(
  <>
    <Arrival />
    <Details />
    <Finale />
    <Marquee text={footer.marquee} />
    <Chapters />
  </>,
);
