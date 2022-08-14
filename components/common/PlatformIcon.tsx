import Image from 'next/image'

interface Props {
  platform?: string
}

export default function PlatformIcon({ platform }: Props) {
  if (platform === 'PC') {
    return (
      <div className="pr-2 flex items-center">
        <Image
          id="windows"
          src={'/icons/windows.svg'}
          width={18}
          height={18}
          alt="windows"
        />
      </div>
    )
  }
  if (platform === 'PlayStation') {
    return (
      <div className="pr-2 flex items-center">
        <Image
          id="playstation"
          src={'/icons/playstation.svg'}
          width={16}
          height={16}
          alt="playstation"
        />
      </div>
    )
  }
  if (platform === 'Xbox') {
    return (
      <div className="pr-2 flex items-center">
        <Image
          id="xbox"
          src={'/icons/xbox.svg'}
          width={16}
          height={16}
          alt="xbox"
        />
      </div>
    )
  }
  if (platform === 'iOS') {
    return (
      <div className="pr-2 flex items-center">
        <Image
          id="ios"
          src={'/icons/ios.svg'}
          width={16}
          height={16}
          alt="ios"
        />
      </div>
    )
  }
  if (platform === 'Android') {
    return (
      <div className="pr-2 flex items-center">
        <Image
          className="icon"
          id="android"
          src={'/icons/android.svg'}
          width={16}
          height={16}
          alt="android"
        />
      </div>
    )
  }
  if (platform === 'Apple Macintosh') {
    return (
      <div className="pr-2 flex items-center">
        <Image
          id="mac"
          src={'/icons/mac.svg'}
          width={16}
          height={16}
          alt="mac"
        />
      </div>
    )
  }
  if (platform === 'Linux') {
    return (
      <div className="pr-2 flex items-center">
        <Image
          id="linux"
          src={'/icons/linux.svg'}
          width={16}
          height={16}
          alt="linux"
        />
      </div>
    )
  }
  if (platform === 'Nintendo') {
    return (
      <div className="pr-2 flex items-center">
        <Image
          id="nintendo"
          src={'/icons/nintendo.svg'}
          width={16}
          height={16}
          alt="nintendo"
        />
      </div>
    )
  }
  if (platform === 'Atari') {
    return (
      <div className="pr-2 flex items-center">
        <Image
          id="atari"
          src={'/icons/atari.svg'}
          width={16}
          height={16}
          alt="atari"
        />
      </div>
    )
  }
  if (platform === 'Amiga') {
    return (
      <div className="pr-2 flex items-center">
        <Image
          id="amiga"
          src={'/icons/amiga.svg'}
          width={16}
          height={16}
          alt="amiga"
        />
      </div>
    )
  }
  if (platform === 'SEGA') {
    return (
      <div className="pr-2 flex items-center">
        <Image
          id="sega"
          src={'/icons/sega.svg'}
          width={16}
          height={16}
          alt="sega"
        />
      </div>
    )
  }
  if (platform === '3DO') {
    return (
      <div className="pr-2 flex items-center">
        <Image
          id="3do"
          src={'/icons/3do.svg'}
          width={16}
          height={16}
          alt="3do"
        />
      </div>
    )
  }
  if (platform === 'Neo Geo') {
    return (
      <div className="pr-2 flex items-center">
        <Image
          id="neo"
          src={'/icons/neo.svg'}
          width={16}
          height={16}
          alt="neo"
        />
      </div>
    )
  }
  if (platform === 'Web') {
    return (
      <div className="pr-2 flex items-center">
        <Image
          id="web"
          src={'/icons/web.svg'}
          width={16}
          height={16}
          alt="web"
        />
      </div>
    )
  }
  return null
}
