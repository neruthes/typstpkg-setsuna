#import "@preview/ose-pic:0.1.2": *
#show: ose-pic-init

#import "@local/setsuna:0.1.0"

#set text(size: 12pt)
#set page(margin: 35mm)

#set text(font: ("Comic Neue",), size: 15pt, fill: black)

// Captured, Header
#setsuna.capture(apply => {
  AddToShipoutBGAll({
    place(top + left, dy: -18mm, box(width: 100%, inset: 35mm, apply[
      #grid(
        columns: (1fr, auto),
        align: (left, right),
        gutter: 12pt,
        [setsuna captured header], [#context here().page()],
      )
    ]))
  })
})

// Not captured, Footer
#AddToShipoutBGAll({
  place(bottom + left, dy: 18mm, box(width: 100%, inset: 35mm, [
    #grid(
      columns: (1fr, auto),
      align: (left, right),
      gutter: 12pt,
      [raw footer], [#context here().page()],
    )
  ]))
})

#let manylorem = ((lorem(120),) * 14).map(par).join()

#manylorem
#pagebreak()
#manylorem

#set text(font: "TeX Gyre Schola", size: 12pt, fill: blue)

#[
  #show grid: set text(size: 35pt)
  #pagebreak()

  #manylorem
  #pagebreak()
  #manylorem
]




/*

w=y ntypstpro demo/demo.typ

*/
