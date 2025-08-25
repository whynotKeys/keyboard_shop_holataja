'use client';

import { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface SoundToggleProps {
  defaultOn?: boolean; // 초기 ON/OFF 상태
  onChange?: (value: boolean) => void; // 상태 변경 시 실행될 콜백
}

export default function SoundToggle({ defaultOn = false, onChange }: SoundToggleProps) {
  const [isOn, setIsOn] = useState<boolean>(defaultOn);
  const hasActivatedAudio = useRef(false); // 중복 실행 방지

  const handleToggle = (): void => {
    const next = !isOn;
    setIsOn(next);
    onChange?.(next);

    // 토글 ON으로 전환 시, 무음 재생을 통해 오디오 권한 획득 시도
    if (next && !hasActivatedAudio.current) {
      try {
        const audio = new Audio('/sounds/keyboardSound_sample.m4a');
        audio.volume = 0;
        audio
          .play()
          .then(() => {
            audio.pause();
            audio.currentTime = 0;
            hasActivatedAudio.current = true;
          })
          .catch(err => {
            console.warn('오디오 권한 획득 실패', err);
          });
      } catch (err) {
        console.warn('오디오 객체 생성 실패', err);
      }
    }
  };

  // defaultOn 값이 바뀌면 내부 상태도 동기화 (선택 사항)
  useEffect(() => {
    setIsOn(defaultOn);
  }, [defaultOn]);

  return (
    <div className="inline-flex flex-col items-center p-2 rounded-lg">
      <div className="flex items-center mb-2">
        <span className="mr-2 label-m">OFF</span>

        <button
          onClick={handleToggle}
          className={`relative w-14 h-8 rounded-full transition-colors duration-300
            ${isOn ? 'bg-primary border-2 border-primary' : 'bg-gray-400 border-2 border-gray-400'}`}
        >
          <span
            className={`absolute top-[2px] left-[2px] w-6 h-6 bg-white rounded-full transition-transform duration-300
              ${isOn ? 'translate-x-6' : 'translate-x-0'}`}
          />
        </button>

        <span className="ml-2 label-m">ON</span>
      </div>

      <div className="flex items-center">
        {isOn ? (
          <>
            <Volume2 size={24} className="text-primary" />
            <span className="ml-2 font-bold label-m text-primary">사운드 켜짐</span>
          </>
        ) : (
          <>
            <VolumeX size={24} className="text-gray-500" />
            <span className="ml-2 label-m text-text">사운드 꺼짐</span>
          </>
        )}
      </div>
    </div>
  );
}
