import Image from 'next/image'

export default function PlatformIcon(props: any) {
  if (props.platform === 'PC') {
    return (
      <div className="pr-2 flex items-center">
        <Image
          id="windows"
          src={'/icons/windows.svg'}
          width={22}
          height={22}
          alt="windows"
        />
      </div>
    )
  }
  if (props.platform === 'PlayStation') {
    return (
      <div className="pr-2 flex items-center">
        <Image
          id="playstation"
          src={'/icons/playstation.svg'}
          width={22}
          height={22}
          alt="playstation"
        />
      </div>
    )
  }
  if (props.platform === 'Xbox') {
    return (
      <div className="pr-2 flex items-center">
        <Image
          id="xbox"
          src={'/icons/xbox.svg'}
          width={22}
          height={22}
          alt="xbox"
        />
      </div>
    )
  }
  if (props.platform === 'iOS') {
    return (
      <div className="pr-2 flex items-center">
        <Image
          id="ios"
          src={'/icons/ios.svg'}
          width={22}
          height={22}
          alt="ios"
        />
      </div>
    )
  }
  if (props.platform === 'Android') {
    return (
      <div className="pr-2 flex items-center">
        <Image
          className="icon"
          id="android"
          src={'/icons/android.svg'}
          width={22}
          height={22}
          alt="android"
        />
      </div>
    )
  }
  if (props.platform === 'Apple Macintosh') {
    return (
      <div className="pr-2 flex items-center">
        <Image
          id="mac"
          src={'/icons/mac.svg'}
          width={22}
          height={22}
          alt="mac"
        />
      </div>
    )
  }
  if (props.platform === 'Linux') {
    return (
      <div className="pr-2 flex items-center">
        <Image
          id="linux"
          src={'/icons/linux.svg'}
          width={22}
          height={22}
          alt="linux"
        />
      </div>
    )
  }
  if (props.platform === 'Nintendo') {
    return (
      <div className="pr-2 flex items-center">
        <Image
          id="nintendo"
          src={'/icons/nintendo.svg'}
          width={22}
          height={22}
          alt="nintendo"
        />
      </div>
    )
  }
  if (props.platform === 'Atari') {
    return (
      <div className="pr-2 flex items-center">
        <Image
          id="atari"
          src={'/icons/atari.svg'}
          width={22}
          height={22}
          alt="atari"
        />
      </div>
    )
  }
  if (props.platform === 'Amiga') {
    return (
      <div className="pr-2 flex items-center">
        <Image
          id="amiga"
          src={'/icons/amiga.svg'}
          width={22}
          height={22}
          alt="amiga"
        />
      </div>
    )
  }
  if (props.platform === 'SEGA') {
    return (
      <div className="pr-2 flex items-center">
        <Image
          id="sega"
          src={'/icons/sega.svg'}
          width={22}
          height={22}
          alt="sega"
        />
      </div>
    )
  }
  if (props.platform === '3DO') {
    return (
      <div className="pr-2 flex items-center">
        <Image
          id="3do"
          src={'/icons/3do.svg'}
          width={22}
          height={22}
          alt="3do"
        />
      </div>
    )
  }
  if (props.platform === 'Neo Geo') {
    return (
      <div className="pr-2 flex items-center">
        <Image
          id="neo"
          src={'/icons/neo.svg'}
          width={22}
          height={22}
          alt="neo"
        />
      </div>
    )
  }
  if (props.platform === 'Web') {
    return (
      <div className="pr-2 flex items-center">
        <Image
          id="web"
          src={'/icons/web.svg'}
          width={22}
          height={22}
          alt="web"
        />
      </div>
    )
  }
  return null
}
