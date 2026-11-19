const program = [
  { title: 'Opening prayer and worship', works: ['The Gathering', 'When They Encounter His Grace', 'All I Have Is You, Lord', 'I Stand in Awe', 'Elohim', 'I Give Myself to You', 'Elizabeth Teke selection', 'Jireh', 'I Need a Revival', 'Jesus, You Are King', 'Aaronic Blessing'] },
  { title: 'Classical choral works', works: ['Sing Unto God', 'Vivat in Aeternum', 'Hallelu to the Lamb', 'Noyana', 'The Messiah', 'For Unto Us a Child Is Born'] },
  { title: 'Christmas carols', works: ['Love Shine a Light', 'Long Time Ago in Bethlehem', 'Mary, Did You Know?', 'The Coming of the Lord', 'The First Nowell', 'Love Is My Christmas Gift', 'Ding Dong', 'O Holy Night', 'Hark! The Herald Angels Sing'] },
  { title: 'Praise and dance finale', works: ['Feliz Navidad', 'Ngisondela Kuwe', 'So So Take My Pain Away', 'Nyame Osa é', 'Massiah Emerigo', 'Yawa', 'Let God Be Praised (T-Son)', 'Ntamboli', 'Tobechukwu'] },
];

export function RepertoireSection() {
  return <section id="program-section" className="paper block">
    <div className="wrap split">
      <div>
        <h2>Concert program</h2>
        <p className="intro">With guest choir <strong>St. Francis Xavier Choir</strong>.</p>
        <div className="music">
          <p>Listen to Handel’s <em>For Unto Us a Child Is Born</em></p>
          <audio controls preload="none" aria-label="For Unto Us a Child Is Born">
            <source src="/audio/for_unto_us_a_child_is_born.mp3" type="audio/mpeg" />
            <source src="/audio/for_unto_us_a_child_is_born.ogg" type="audio/ogg" />
          </audio>
        </div>
      </div>
      <div className="setlist">{program.map(part => <details key={part.title}>
        <summary>{part.title}</summary>
        <ul>{part.works.map(work => <li key={work}>{work}</li>)}</ul>
      </details>)}</div>
    </div>
  </section>;
}
