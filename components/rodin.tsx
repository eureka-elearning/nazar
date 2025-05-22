// Update the mobile menu state management in the Rodin component
const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

// Update the mobile menu close handler
const handleMobileMenuClose = () => {
  setMobileMenuOpen(false)
}

// Update the Sheet component props
<Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
  <SheetContent
    onInteractOutside={handleMobileMenuClose}
    onEscapeKeyDown={handleMobileMenuClose}
    side="left"
    className="w-[300px] sm:w-[400px]"
  >
    <SheetHeader>
      <SheetTitle>{title}</SheetTitle>
    </SheetHeader>
    <div className="flex flex-col gap-4 py-4">
      {menuItems.map((item) => (
        <MenuItem key={item.href} {...item} />
      ))}
    </div>
  </SheetContent>
</Sheet>