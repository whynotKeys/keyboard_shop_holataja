'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import SoundToggle from './SoundToggle';

interface KeyDefinition {
  label: string;
  code: string;
}

interface KeySoundDemoProps {
  soundFilePath: string;
}

export default function KeySoundDemo({ soundFilePath }: KeySoundDemoProps) {
  // 키 배열 라벨/코드 정의
  const keysToRender: KeyDefinition[][] = useMemo(
    () => [
      [
        { label: '~', code: '`' },
        { label: '1', code: '1' },
        { label: '2', code: '2' },
        { label: '3', code: '3' },
        { label: '4', code: '4' },
        { label: '5', code: '5' },
        { label: '6', code: '6' },
        { label: '7', code: '7' },
        { label: '8', code: '8' },
        { label: '9', code: '9' },
        { label: '0', code: '0' },
        { label: '-', code: '-' },
        { label: '=', code: '=' },
        { label: 'Backspace', code: 'Backspace' },
      ],
      [
        { label: 'Tab', code: 'Tab' },
        { label: 'Q', code: 'q' },
        { label: 'W', code: 'w' },
        { label: 'E', code: 'e' },
        { label: 'R', code: 'r' },
        { label: 'T', code: 't' },
        { label: 'Y', code: 'y' },
        { label: 'U', code: 'u' },
        { label: 'I', code: 'i' },
        { label: 'O', code: 'o' },
        { label: 'P', code: 'p' },
        { label: '[', code: '[' },
        { label: ']', code: ']' },
        { label: '\\', code: '\\' },
      ],
      [
        { label: 'CapsLock', code: 'CapsLock' },
        { label: 'A', code: 'a' },
        { label: 'S', code: 's' },
        { label: 'D', code: 'd' },
        { label: 'F', code: 'f' },
        { label: 'G', code: 'g' },
        { label: 'H', code: 'h' },
        { label: 'J', code: 'j' },
        { label: 'K', code: 'k' },
        { label: 'L', code: 'l' },
        { label: ';', code: ';' },
        { label: "'", code: "'" },
        { label: 'Enter', code: 'Enter' },
      ],
      [
        { label: 'Shift', code: 'Shift' },
        { label: 'Z', code: 'z' },
        { label: 'X', code: 'x' },
        { label: 'C', code: 'c' },
        { label: 'V', code: 'v' },
        { label: 'B', code: 'b' },
        { label: 'N', code: 'n' },
        { label: 'M', code: 'm' },
        { label: ',', code: ',' },
        { label: '.', code: '.' },
        { label: '/', code: '/' },
        { label: 'Shift', code: 'Shift' },
      ],
      [
        { label: 'Ctrl', code: 'Control' },
        { label: 'Alt', code: 'Alt' },
        { label: 'Space', code: ' ' },
        { label: 'Alt', code: 'Alt' },
        { label: 'Ctrl', code: 'Control' },
      ],
    ],
    [],
  );

  // 키 너비
  const defaultWidth = 'w-[2.8125rem]';
  const keyWidths: Record<string, string> = {
    Tab: 'w-[5.625rem]',
    '\\': 'w-[4.375rem]',
    CapsLock: 'w-[6rem]',
    Enter: 'w-[7rem]',
    Shift: 'w-[8rem]',
    Ctrl: 'w-[3.75rem]',
    Alt: 'w-[3.75rem]',
    Space: 'w-[31rem]',
    Backspace: 'w-[7.25rem]',
  };

  // 현재 눌려있는 키들을 추적하기 위한 Set 객체
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
  const [useDemo, setUseDemo] = useState(false);

  // 사운드 재생 로직을 별도 함수로 분리
  const playKeySound = useCallback(() => {
    if (useDemo) {
      const audio = new Audio(soundFilePath);
      audio.play().catch(err => {
        console.error('Sound play error:', err);
      });
    }
  }, [useDemo, soundFilePath]);

  // 전역 키보드 이벤트 핸들러
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // 눌린 키가 우리가 렌더링한 키 목록에 포함되는지 확인
      const matchedKey = keysToRender.flat().find(k => k.code.toLowerCase() === e.key.toLowerCase());
      if (matchedKey && !pressedKeys.has(matchedKey.label)) {
        setPressedKeys(prev => new Set(prev).add(matchedKey.label));
        playKeySound();
      }
    },
    [pressedKeys, playKeySound, keysToRender],
  );

  const handleKeyUp = useCallback(
    (e: KeyboardEvent) => {
      const matchedKey = keysToRender.flat().find(k => k.code.toLowerCase() === e.key.toLowerCase());
      if (matchedKey) {
        setPressedKeys(prev => {
          const newSet = new Set(prev);
          newSet.delete(matchedKey.label);
          return newSet;
        });
      }
    },
    [keysToRender],
  );

  // useEffect를 사용하여 컴포넌트 마운트/언마운트 시 전역 이벤트 리스너 등록/해제
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // 클린업 함수: 컴포넌트가 언마운트될 때 이벤트 리스너를 제거
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]); // 의존성 배열에 핸들러 함수를 포함

  // 마우스 클릭 이벤트 핸들러: 클릭된 키를 인자로 받아 처리
  const handleMouseDown = (key: string) => {
    setPressedKeys(prev => new Set(prev).add(key));
    playKeySound();
  };
  const handleMouseStop = (key: string) => {
    setPressedKeys(prev => {
      const newSet = new Set(prev);
      newSet.delete(key);
      return newSet;
    });
  };

  return (
    <div className="flex flex-col items-center justify-center w-full pb-5 overflow-x-auto">
      <div className="">
        <div className="flex justify-end w-full">
          <SoundToggle defaultOn={false} onChange={setUseDemo} />
        </div>
        <div className="flex flex-col items-center p-3 space-y-1 bg-gray-100 border-3 border-gray rounded-xl">
          {keysToRender.map((row, rowIndex) => (
            <div key={rowIndex} className="flex space-x-1">
              {row.map((key, index) => (
                <button
                  key={`${rowIndex}-${index}`}
                  className={`
                  relative px-4 py-3 ${keyWidths[key.label] || defaultWidth} h-12
                  border border-gray-300 
                  rounded-lg text-sm font-medium text-text
                  transition-all duration-75 ease-out
                  ${pressedKeys.has(key.label) ? 'bg-gray-300 translate-y-1 shadow-sm' : 'bg-white translate-y-0 shadow-md hover:shadow-lg'}
                  before:absolute before:inset-0 before:rounded-lg before:border before:border-gray-200
                  hover:bg-gray-100 active:bg-gray-300 focus:ring-gray-500 
                  `}
                  onMouseDown={() => handleMouseDown(key.label)}
                  onMouseUp={() => handleMouseStop(key.label)}
                  onMouseLeave={() => handleMouseStop(key.label)}
                >
                  <span className="relative z-10">{key.label}</span>
                </button>
              ))}
            </div>
          ))}
        </div>
        <div className="w-full mt-3 text-sm text-right text-gray-600">※ Nuphy에서 정식으로 제공 받아 가공한 사운드입니다.</div>
      </div>
    </div>
  );
}
